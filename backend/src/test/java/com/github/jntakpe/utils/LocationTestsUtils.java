package com.github.jntakpe.utils;

import com.github.jntakpe.entity.Location;
import com.github.jntakpe.repository.LocationRepository;
import com.github.jntakpe.service.LocationServiceTests;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Location}
 *
 * @author jntakpe
 */
@Component
public class LocationTestsUtils {

    private final LocationRepository locationRepository;

    @Autowired
    public LocationTestsUtils(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location findAnyLocation() {
        return locationRepository.findAll().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No location"));
    }

    public Location findDefaultLocation() {
        return locationRepository.findByNameIgnoreCase(LocationServiceTests.EXISTING_NAME)
                .orElseThrow(() -> new IllegalStateException("No location"));
    }

    public void flush() {
        locationRepository.flush();
    }

    public List<Location> findAll() {
        return locationRepository.findAll();
    }
}
