package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.config.security.AuthoritiesConstants;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Rating;
import com.github.jntakpe.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
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

    @ResponseStatus(HttpStatus.CREATED)
    @RolesAllowed({AuthoritiesConstants.ADMIN, AuthoritiesConstants.TRAINER})
    @RequestMapping(value = UriConstants.RATINGS_BY_SESSION, method = RequestMethod.POST)
    public Rating registerToSession(@PathVariable Long sessionId, @RequestBody @Valid Employee employee) {
        return ratingService.register(sessionId, employee);
    }

    @RequestMapping(value = UriConstants.RATINGS_BY_SESSION + "/{ratingId}", method = RequestMethod.PUT)
    public Rating rateSession(@PathVariable Long sessionId, @PathVariable Long ratingId, @RequestBody @Valid Rating rating) {
        rating.setId(ratingId);
        return ratingService.rate(sessionId, rating);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RolesAllowed({AuthoritiesConstants.ADMIN, AuthoritiesConstants.TRAINER})
    @RequestMapping(value = UriConstants.RATINGS_BY_SESSION + "/{ratingId}", method = RequestMethod.DELETE)
    public void unregisterFromSession(@PathVariable Long sessionId, @PathVariable Long ratingId) {
        ratingService.unregister(sessionId, ratingId);
    }
}
