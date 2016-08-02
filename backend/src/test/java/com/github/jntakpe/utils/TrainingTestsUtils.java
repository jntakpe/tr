package com.github.jntakpe.utils;

import com.github.jntakpe.model.Training;
import com.github.jntakpe.repository.TrainingRepository;
import com.github.jntakpe.service.TrainingServiceTests;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Training}
 *
 * @author jntakpe
 */
@Component
public class TrainingTestsUtils {

    private final TrainingRepository trainingRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public TrainingTestsUtils(TrainingRepository trainingRepository) {
        this.trainingRepository = trainingRepository;
    }

    @Transactional(readOnly = true)
    public Training findAnyTraining() {
        Training defaultTraining = findDefaultTraining();
        return trainingRepository.findAll().stream()
                .filter(t -> !t.equals(defaultTraining))
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No training"));
    }

    @Transactional(readOnly = true)
    public Training findDefaultTraining() {
        return trainingRepository.findByNameIgnoreCase(TrainingServiceTests.EXISTING_NAME)
                .orElseThrow(() -> new IllegalStateException("No training"));
    }

    @Transactional(readOnly = true)
    public Training findAnyTrainingButThis(Training training) {
        return trainingRepository.findAll().stream()
                .filter(t -> !t.getId().equals(training.getId()))
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No training except default one"));
    }

    @Transactional(readOnly = true)
    public Training findUnusedTraining() {
        return trainingRepository.findAll().stream()
                .filter(t -> t.getSessions().isEmpty())
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No unused training"));
    }

    @Transactional(readOnly = true)
    public Training findUsedTraining() {
        return trainingRepository.findAll().stream()
                .filter(t -> !t.getSessions().isEmpty())
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No used training"));
    }

    public void flush() {
        trainingRepository.flush();
    }

    public void detach(Training training) {
        entityManager.detach(training);
    }
}
