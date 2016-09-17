package com.github.jntakpe.service;

import com.github.jntakpe.model.Location;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.repository.LocationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Services associés à l'entité {@link Location}
 *
 * @author jntakpe
 */
@Service
@CacheConfig(cacheNames = "locations")
public class LocationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(LocationService.class);

    private LocationRepository locationRepository;

    private SessionService sessionService;

    @Autowired
    public LocationService(LocationRepository locationRepository, SessionService sessionService) {
        this.locationRepository = locationRepository;
        this.sessionService = sessionService;
    }

    @Cacheable
    @Transactional(readOnly = true)
    public List<Location> findAll() {
        LOGGER.debug("Recherche de l'ensemble des sites de formation");
        List<Location> locations = locationRepository.findAll();
        return countNbSessions(locations);
    }

    @Transactional
    @CacheEvict(allEntries = true)
    public Location save(Location location) {
        Objects.requireNonNull(location);
        checkNameAndCityAvailable(location);
        LOGGER.info("{} du site de formation {}", location.isNew() ? "Création" : "Modification", location);
        return locationRepository.save(location);
    }

    @Transactional
    @CacheEvict(allEntries = true)
    public void delete(Long id) {
        Location location = findById(id);
        LOGGER.info("Suppression du lieu {}", location);
        locationRepository.delete(location);
    }

    @Transactional(readOnly = true)
    public List<String> findConstraints(Long id) {
        Location location = findById(id);
        return findConstraintStrings(location);
    }

    private List<Location> countNbSessions(List<Location> locations) {
        locations.forEach(l -> l.setNbSessions(sessionService.countByLocationId(l.getId())));
        return locations;
    }

    private void checkNameAndCityAvailable(Location location) {
        Optional<Location> opt = locationRepository.findByNameAndCityAllIgnoreCase(location.getName(), location.getCity());
        if (opt.isPresent() && !opt.get().getId().equals(location.getId())) {
            String msg = String.format("Le nom de site %s dans la ville %s est déjà pris", location.getName(), location.getCity());
            throw new ValidationException(msg);
        }
    }

    private Location findById(Long id) {
        Objects.requireNonNull(id);
        Location location = locationRepository.findOne(id);
        if (location == null) {
            LOGGER.warn("Aucun lieu possédant l'id {}", id);
            throw new EntityNotFoundException("Aucune lieu possédant l'id " + id);
        }
        return location;
    }

    private List<String> findConstraintStrings(Location location) {
        return location.getSessions().stream()
                .map(Session::toStringConstraint)
                .collect(Collectors.toList());
    }

}
