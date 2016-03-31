package com.github.jntakpe.service;

import com.github.jntakpe.entity.Location;
import com.github.jntakpe.repository.LocationRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

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

    @Test
    public void save_shouldUpdate() {
        Location location = locationService.findAll().stream().findAny().orElseThrow(() -> new IllegalStateException("No location"));
        String updatedLocationName = "updatedLocation";
        location.setName(updatedLocationName);
        locationRepository.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE name=LOWER('" + updatedLocationName + "')";
        Location result = jdbcTemplate.queryForObject(query, (rs, rowNum) -> new Location(rs.getString("name")));
        assertThat(result).isNotNull();
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void save_shouldFailToCreateCuzSameNameIgnoreCase() {
        locationService.save(new Location(EXISTING_NAME.toUpperCase()));
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void save_shouldFailToCreateCuzSameNameMatchCase() {
        locationService.save(new Location(EXISTING_NAME));
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void save_shouldFailToUpdateCuzSameNameMatchCase() {
        List<Location> locations = locationRepository.findAll();
        assertThat(locations.size()).isGreaterThanOrEqualTo(2);
        locations.get(0).setName(locations.get(1).getName());
        locationRepository.flush();
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }
}
