package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Training;
import com.github.jntakpe.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Publication de la ressource {@link Training}
 *
 * @author jntakpe
 */
@RestController
@RequestMapping(UriConstants.TRAININGS)
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

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(method = RequestMethod.POST)
    public Training create(@RequestBody @Valid Training training) {
        return trainingService.save(training);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public Training update(@PathVariable Long id, @RequestBody @Valid Training training) {
        training.setId(id);
        return trainingService.save(training);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable Long id) {
        trainingService.delete(id);
    }

    @RequestMapping(value = "/{id}/constraints", method = RequestMethod.GET)
    public List<String> constraints(@PathVariable Long id) {
        return trainingService.findConstraints(id);
    }

}
