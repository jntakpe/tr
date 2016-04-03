package com.github.jntakpe.service;

import com.github.jntakpe.entity.Location;
import com.github.jntakpe.entity.Session;
import com.github.jntakpe.repository.LocationRepository;
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
    private LocationRepository locationRepository;

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
        Location ramassiers = locationService.save(new Location("Toulouse ramassiers"));
        assertThat(ramassiers).isNotNull();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameIgnoreCase() {
        locationService.save(new Location(EXISTING_NAME.toUpperCase()));
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameMatchCase() {
        locationService.save(new Location(EXISTING_NAME));
    }

    @Test
    public void save_shouldUpdate() {
        Location location = findAnyLocation();
        String updatedLocationName = "updatedLocation";
        location.setName(updatedLocationName);
        locationRepository.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE name=LOWER('" + updatedLocationName + "')";
        Location result = jdbcTemplate.queryForObject(query, (rs, rowNum) -> new Location(rs.getString("name")));
        assertThat(result).isNotNull();
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToUpdateCuzSameNameMatchCase() {
        List<Location> locations = locationRepository.findAll();
        assertThat(locations.size()).isGreaterThanOrEqualTo(2);
        Location location = new Location(locations.get(1).getName());
        location.setId(locations.get(0).getId());
        locationService.save(location);
    }

    @Test
    public void delete_shouldRemoveOne() {
        Location location = findAnyLocation();
        locationService.delete(location.getId());
        locationRepository.flush();
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

    private Location findAnyLocation() {
        return locationRepository.findAll().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No location"));
    }
}
