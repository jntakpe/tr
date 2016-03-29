package com.github.jntakpe.service;

import com.github.jntakpe.entity.Location;
import com.github.jntakpe.repository.LocationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}
