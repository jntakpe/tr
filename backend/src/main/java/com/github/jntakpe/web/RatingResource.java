package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Rating;
import com.github.jntakpe.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Exposition de la ressource {@link Rating}
 *
 * @author jntakpe
 */
@RestController
@RequestMapping(UriConstants.RATINGS)
public class RatingResource {

    private final RatingService ratingService;

    @Autowired
    public RatingResource(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Rating> findBySessionId(@PathVariable Long sessionId) {
        return ratingService.findBySessionId(sessionId);
    }

}
