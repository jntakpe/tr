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

    @Transactional(readOnly = true)
    public Optional<Location> findByName(String name) {
        //TODO vérifier que cette méthode n'est pas inutile
        LOGGER.debug("Recherche du site de formation {}", name);
        return locationRepository.findByNameIgnoreCase(name);
    }

    @Transactional
    public Location save(Location location) {
        Objects.requireNonNull(location);
        checkNameAvailable(location);
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

    private void checkNameAvailable(Location location) {
        Optional<Location> opt = locationRepository.findByNameIgnoreCase(location.getName());
        if (opt.isPresent() && !opt.get().getId().equals(location.getId())) {
            throw new ValidationException("Le nom de lieu : " + location.getName() + " est déjà pris");
        }
    }
}
