package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.config.security.AuthoritiesConstants;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.model.Training;
import com.github.jntakpe.service.SessionService;
import com.github.jntakpe.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
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

    private final TrainingService trainingService;

    private final SessionService sessionService;

    @Autowired
    public TrainingResource(TrainingService trainingService, SessionService sessionService) {
        this.trainingService = trainingService;
        this.sessionService = sessionService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Training> findAll() {
        return trainingService.findAll();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    @RequestMapping(method = RequestMethod.POST)
    public Training create(@RequestBody @Valid Training training) {
        return trainingService.save(training);
    }

    @RolesAllowed(AuthoritiesConstants.ADMIN)
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public Training update(@PathVariable Long id, @RequestBody @Valid Training training) {
        training.setId(id);
        return trainingService.save(training);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable Long id) {
        trainingService.delete(id);
    }

    @RolesAllowed(AuthoritiesConstants.ADMIN)
    @RequestMapping(value = "/{id}/constraints", method = RequestMethod.GET)
    public ResponseEntity<List<String>> constraints(@PathVariable Long id) {
        List<String> constraints = trainingService.findConstraints(id);
        return constraints.isEmpty() ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(constraints, HttpStatus.OK);
    }

    @RolesAllowed(AuthoritiesConstants.ADMIN)
    @RequestMapping(value = "/{id}/sessions", method = RequestMethod.GET)
    public List<Session> findSessions(@PathVariable Long id) {
        return sessionService.findByTrainingId(id);
    }

}
