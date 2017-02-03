package com.github.jntakpe.web;

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

import static com.github.jntakpe.config.UriConstants.RATINGS_BY_SESSION;

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

    @GetMapping(RATINGS_BY_SESSION)
    public List<Rating> findBySession(@PathVariable Long sessionId) {
        return ratingService.findBySessionId(sessionId);
    }

    @PostMapping(RATINGS_BY_SESSION)
    @ResponseStatus(HttpStatus.CREATED)
    @RolesAllowed({AuthoritiesConstants.ADMIN, AuthoritiesConstants.TRAINER})
    public Rating registerToSession(@PathVariable Long sessionId, @RequestBody @Valid Employee employee) {
        return ratingService.register(sessionId, employee);
    }

    @PutMapping(RATINGS_BY_SESSION + "/{ratingId}")
    public Rating rateSession(@PathVariable Long sessionId, @PathVariable Long ratingId, @RequestBody @Valid Rating rating) {
        rating.setId(ratingId);
        return ratingService.rate(sessionId, rating);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(RATINGS_BY_SESSION + "/{ratingId}")
    @RolesAllowed({AuthoritiesConstants.ADMIN, AuthoritiesConstants.TRAINER})
    public void unregisterFromSession(@PathVariable Long sessionId, @PathVariable Long ratingId) {
        ratingService.unregister(sessionId, ratingId);
    }
}
