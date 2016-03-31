package com.github.jntakpe.service;

import com.github.jntakpe.entity.Location;
import com.github.jntakpe.repository.LocationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Services associés à l'entité {@link Location}
 *
 * @author jntakpe
 */
@Service
public class LocationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(LocationService.class);

    private LocationRepository locationRepository;

    @Autowired
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public List<Location> findAll() {
        LOGGER.debug("Recherche de l'ensemble des sites de formation");
        return locationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Location> findByName(String name) {
        LOGGER.debug("Recherche du site de formation {}", name);
        return locationRepository.findByNameIgnoreCase(name);
    }

    @Transactional
    public Location save(Location location) {
        Objects.requireNonNull(location);
        LOGGER.info("{} du site de formation {}", location.isNew() ? "Création" : "Modification", location);
        return locationRepository.save(location);
    }

}
