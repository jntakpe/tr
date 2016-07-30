package com.github.jntakpe.service;

import com.github.jntakpe.entity.Location;
import com.github.jntakpe.repository.LocationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
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

    @Transactional
    public Location save(Location location) {
        Objects.requireNonNull(location);
        checkNameAndCityAvailable(location);
        LOGGER.info("{} du site de formation {}", location.isNew() ? "Création" : "Modification", location);
        return locationRepository.save(location);
    }

    @Transactional
    public void delete(Long id) {
        Location location = findById(id);
        LOGGER.info("Suppression du lieu {}", location);
        locationRepository.delete(location);
    }

    private Location findById(Long id) {
        Objects.requireNonNull(id);
        Location location = locationRepository.findOne(id);
        if (Objects.isNull(location)) {
            LOGGER.warn("Aucun lieu possédant l'id {}", id);
            throw new EntityNotFoundException("Aucune lieu possédant l'id " + id);
        }
        return location;
    }

    private void checkNameAndCityAvailable(Location location) {
        Optional<Location> opt = locationRepository.findByNameAndCityAllIgnoreCase(location.getName(), location.getCity());
        if (opt.isPresent() && !opt.get().getId().equals(location.getId())) {
            String msg = String.format("Le nom de site %s dans la ville %s est déjà pris", location.getName(), location.getCity());
            throw new ValidationException(msg);
        }
    }
}
