package com.github.jntakpe.service;

import com.github.jntakpe.entity.Location;
import com.github.jntakpe.entity.Session;
import com.github.jntakpe.utils.LocationTestsUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests associés à l'entité {@link Location}
 *
 * @author jntakpe
 */
public class LocationServiceTests extends AbstractTestsService {

    public static final String TABLE_NAME = "location";

    public static final String EXISTING_NAME = "paris triangle";

    @Autowired
    private LocationService locationService;

    @Autowired
    private LocationTestsUtils locationTestsUtils;

    @Test
    public void findAll_shouldFind() {
        assertThat(locationService.findAll()).isNotEmpty().hasSize(nbEntries);
    }

    @Test
    public void findByName_shouldNotFind() {
        assertThat(locationService.findByName("unknown")).isEmpty();
    }

    @Test
    public void findByName_shouldFindIgnoringCase() {
        assertThat(locationService.findByName(EXISTING_NAME.toUpperCase())).isPresent();
    }

    @Test
    public void findByName_shouldFindMatchingCase() {
        assertThat(locationService.findByName(EXISTING_NAME)).isPresent();
    }

    @Test
    public void save_shouldCreate() {
        Location location = new Location();
        location.setName("Toulouse ramassiers");
        Location ramassiers = locationService.save(location);
        assertThat(ramassiers).isNotNull();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameIgnoreCase() {
        Location location = new Location();
        location.setName(EXISTING_NAME.toUpperCase());
        locationService.save(location);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameMatchCase() {
        Location location = new Location();
        location.setName(EXISTING_NAME);
        locationService.save(location);
    }

    @Test
    public void save_shouldUpdate() {
        Location location = locationTestsUtils.findAnyLocation();
        String updatedLocationName = "updatedLocation";
        location.setName(updatedLocationName);
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
        locationService.save(location);
    }

    @Test
    public void delete_shouldRemoveOne() {
        Location location = locationTestsUtils.findAnyLocation();
        locationService.delete(location.getId());
        locationTestsUtils.flush();
        String query = "SELECT id FROM " + TABLE_NAME + " WHERE name=LOWER('" + location.getName() + "')";
        assertThat(jdbcTemplate.queryForList(query, Long.class)).isEmpty();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries - 1);
        String linkedQuery = "SELECT id FROM " + SessionServiceTest.TABLE_NAME + " WHERE location_id = " + location.getId();
        assertThat(jdbcTemplate.queryForList(linkedQuery, Session.class)).isEmpty();
    }

    @Test(expected = EntityNotFoundException.class)
    public void delete_shouldFailCuzIdDoesntExist() {
        locationService.delete(999L);
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

}
