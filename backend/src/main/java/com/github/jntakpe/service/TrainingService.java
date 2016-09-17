package com.github.jntakpe.service;

import com.github.jntakpe.model.Session;
import com.github.jntakpe.model.Training;
import com.github.jntakpe.repository.TrainingRepository;
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
 * Services associés à la gestion d'une formation
 *
 * @author jntakpe
 */
@Service
@CacheConfig(cacheNames = "trainings")
public class TrainingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TrainingService.class);

    private TrainingRepository trainingRepository;

    @Autowired
    public TrainingService(TrainingRepository trainingRepository) {
        this.trainingRepository = trainingRepository;
    }

    @Cacheable
    @Transactional(readOnly = true)
    public List<Training> findAll() {
        LOGGER.debug("Récupération de toutes les formations");
        return trainingRepository.findAll();
    }

    @Transactional
    @CacheEvict(allEntries = true)
    public Training save(Training training) {
        Objects.requireNonNull(training);
        checkNameAvailable(training);
        LOGGER.info("{} de la formation {}", training.isNew() ? "Création" : "Modification", training);
        return trainingRepository.save(training);
    }

    @Transactional
    @CacheEvict(allEntries = true)
    public void delete(Long id) {
        Training training = findById(id);
        LOGGER.info("Suppression de la formation {}", training);
        trainingRepository.delete(training);
    }

    @Transactional(readOnly = true)
    public List<String> findConstraints(Long id) {
        Training training = findById(id);
        return findConstraintStrings(training);
    }

    private void checkNameAvailable(Training training) {
        Optional<Training> opt = trainingRepository.findByNameIgnoreCase(training.getName());
        if (opt.isPresent() && !opt.get().getId().equals(training.getId())) {
            throw new ValidationException("Le nom " + training.getName() + " de la formation est déjà pris");
        }
    }

    private Training findById(Long id) {
        Objects.requireNonNull(id);
        Training training = trainingRepository.findOne(id);
        if (training == null) {
            LOGGER.warn("Aucune formation possédant l'id {}", id);
            throw new EntityNotFoundException("Aucune formation possédant l'id " + id);
        }
        return training;
    }

    private List<String> findConstraintStrings(Training training) {
        return training.getSessions().stream()
                .map(Session::toStringConstraint)
                .collect(Collectors.toList());
    }

}
