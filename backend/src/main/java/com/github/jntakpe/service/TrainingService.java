package com.github.jntakpe.service;

import com.github.jntakpe.entity.Training;
import com.github.jntakpe.repository.TrainingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Services associés à la gestion d'une formation
 *
 * @author jntakpe
 */
@Service
public class TrainingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TrainingService.class);

    private TrainingRepository trainingRepository;

    @Autowired
    public TrainingService(TrainingRepository trainingRepository) {
        this.trainingRepository = trainingRepository;
    }

    @Transactional(readOnly = true)
    public List<Training> findAll() {
        LOGGER.debug("Récupération de toutes les formations");
        return trainingRepository.findAll();
    }
}
