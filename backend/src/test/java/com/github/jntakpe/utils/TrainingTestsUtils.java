package com.github.jntakpe.utils;

import com.github.jntakpe.entity.Training;
import com.github.jntakpe.repository.TrainingRepository;
import com.github.jntakpe.service.TrainingServiceTest;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Training}
 *
 * @author jntakpe
 */
@Component
public class TrainingTestsUtils {

    private final TrainingRepository trainingRepository;

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
        return trainingRepository.findByNameIgnoreCase(TrainingServiceTest.EXISTING_NAME)
                .orElseThrow(() -> new IllegalStateException("No training"));
    }

    @Transactional(readOnly = true)
    public Training findAnyTrainingButThis(Training training) {
        return trainingRepository.findAll().stream()
                .filter(t -> !t.getId().equals(training.getId()))
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No training except default one"));
    }

    public void flush() {
        trainingRepository.flush();
    }
}
