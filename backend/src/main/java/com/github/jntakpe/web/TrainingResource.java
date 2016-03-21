package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Training;
import com.github.jntakpe.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Publication de la ressource {@link com.github.jntakpe.entity.Training}
 *
 * @author jntakpe
 */
@RestController
@RequestMapping(UriConstants.TRAINING)
public class TrainingResource {

    private TrainingService trainingService;

    @Autowired
    public TrainingResource(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Training> findAll() {
        return trainingService.findAll();
    }
}
