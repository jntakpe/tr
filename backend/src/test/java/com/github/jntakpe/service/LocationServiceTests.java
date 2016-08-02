package com.github.jntakpe.service;

import com.github.jntakpe.model.Location;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.utils.LocationTestsUtils;
import com.github.jntakpe.utils.SessionTestsUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * Tests associés à l'entité {@link Location}
 *
 * @author jntakpe
 */
public class LocationServiceTests extends AbstractDBServiceTests {

    public static final String TABLE_NAME = "location";

    public static final String EXISTING_NAME = "triangle";

    public static final String EXISTING_CITY = "Paris";

    @Autowired
    private LocationService locationService;

    @Autowired
    private LocationTestsUtils locationTestsUtils;

    @Autowired
    private SessionTestsUtils sessionTestsUtils;

    @Test
    public void findAll_shouldFind() {
        assertThat(locationService.findAll()).isNotEmpty().hasSize(nbEntries);
    }

    @Test
    public void save_shouldCreate() {
        Location location = new Location();
        location.setName("Ramassiers");
        location.setCity("Toulouse");
        Location ramassiers = locationService.save(location);
        assertThat(ramassiers).isNotNull();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameAndCityIgnoreCase() {
        Location location = new Location();
        location.setName(EXISTING_NAME.toUpperCase());
        location.setCity(EXISTING_CITY.toUpperCase());
        locationService.save(location);
        fail("should have failed at this point");
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameAndCityMatchCase() {
        Location location = new Location();
        location.setName(EXISTING_NAME);
        location.setCity(EXISTING_CITY);
        locationService.save(location);
        fail("should have failed at this point");
    }

    @Test
    public void save_shouldUpdate() {
        Location location = locationTestsUtils.findAnyLocation();
        locationTestsUtils.detach(location);
        String updatedLocationName = "updatedLocation";
        location.setName(updatedLocationName);
        locationService.save(location);
        locationTestsUtils.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE name=LOWER('" + updatedLocationName + "')";
        Location result = jdbcTemplate.queryForObject(query, (rs, rowNum) -> {
            Location mapper = new Location();
            mapper.setName(rs.getString("name"));
            return mapper;
        });
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualToIgnoringCase(updatedLocationName);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToUpdateCuzSameNameMatchCase() {
        List<Location> locations = locationTestsUtils.findAll();
        assertThat(locations.size()).isGreaterThanOrEqualTo(2);
        Location location = new Location();
        location.setId(locations.get(0).getId());
        location.setName(locations.get(1).getName());
        location.setCity(locations.get(1).getCity());
        locationService.save(location);
        fail("should have failed at this point");
    }

    @Test
    public void delete_shouldRemoveOne() {
        Location location = locationTestsUtils.findUnusedLocation();
        locationService.delete(location.getId());
        locationTestsUtils.flush();
        String query = "SELECT id FROM " + TABLE_NAME + " WHERE name=LOWER('" + location.getName() + "')";
        assertThat(jdbcTemplate.queryForList(query, Long.class)).isEmpty();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries - 1);
        String linkedQuery = "SELECT id FROM " + SessionServiceTests.TABLE_NAME + " WHERE location_id = " + location.getId();
        assertThat(jdbcTemplate.queryForList(linkedQuery, Session.class)).isEmpty();
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void delete_shouldFailCuzLocationUsedByRelation() {
        Location location = sessionTestsUtils.findAnySession().getLocation();
        locationService.delete(location.getId());
        locationTestsUtils.flush();
        fail("should have failed at this point");
    }

    @Test(expected = EntityNotFoundException.class)
    public void delete_shouldFailCuzIdDoesntExist() {
        locationService.delete(999L);
        fail("should have failed at this point");
    }

    @Test
    public void findConstraints_shouldBeEmpty() {
        assertThat(locationService.findConstraints(locationTestsUtils.findUnusedLocation().getId())).isEmpty();
    }

    @Test
    public void findConstaints_shouldNotBeEmpty() {
        assertThat(locationService.findConstraints(locationTestsUtils.findUsedLocation().getId())).isNotEmpty();
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

}
