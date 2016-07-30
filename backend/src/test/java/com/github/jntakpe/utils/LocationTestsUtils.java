package com.github.jntakpe.utils;

import com.github.jntakpe.entity.Location;
import com.github.jntakpe.repository.LocationRepository;
import com.github.jntakpe.service.LocationServiceTests;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Location}
 *
 * @author jntakpe
 */
@Component
public class LocationTestsUtils {

    private final LocationRepository locationRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public LocationTestsUtils(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public Location findAnyLocation() {
        Location defaultLocation = findDefaultLocation();
        return locationRepository.findAll().stream()
                .filter(l -> !l.equals(defaultLocation))
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No location"));
    }

    @Transactional(readOnly = true)
    public Location findDefaultLocation() {
        return locationRepository.findByNameAndCityAllIgnoreCase(LocationServiceTests.EXISTING_NAME, LocationServiceTests.EXISTING_CITY)
                .orElseThrow(() -> new IllegalStateException("No location"));
    }

    @Transactional(readOnly = true)
    public List<Location> findAll() {
        return locationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Location findUsedLocation() {
        return locationRepository.findAll().stream()
                .filter(l -> !l.getSessions().isEmpty())
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No used location"));
    }

    @Transactional(readOnly = true)
    public Location findUnusedLocation() {
        return locationRepository.findAll().stream()
                .filter(l -> l.getSessions().isEmpty())
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No unused location"));
    }

    public void flush() {
        locationRepository.flush();
    }

    public void detach(Location location) {
        entityManager.detach(location);
    }
}
