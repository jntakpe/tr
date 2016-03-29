package com.github.jntakpe.service;

import com.github.jntakpe.entity.Location;
import com.github.jntakpe.repository.LocationRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests associés à l'entité {@link Location}
 *
 * @author jntakpe
 */
public class LocationServiceTests extends AbstractTestsService {

    public static final String TABLE_NAME = "location";

    public static final String EXISTING_NAME = "Paris triangle";

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

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }
}
