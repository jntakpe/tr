package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Rating;
import com.github.jntakpe.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Exposition de la ressource {@link Rating}
 *
 * @author jntakpe
 */
@RestController
public class RatingResource {

    private final RatingService ratingService;

    @Autowired
    public RatingResource(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @RequestMapping(value = UriConstants.RATINGS_BY_SESSION, method = RequestMethod.GET)
    public List<Rating> findBySession(@PathVariable Long sessionId) {
        return ratingService.findBySessionId(sessionId);
    }

    @RequestMapping(value = UriConstants.RATINGS_BY_SESSION, method = RequestMethod.POST)
    public Rating registerToSession(@PathVariable Long sessionId, @RequestBody @Valid Employee employee) {
        return ratingService.register(sessionId, employee);
    }

}
