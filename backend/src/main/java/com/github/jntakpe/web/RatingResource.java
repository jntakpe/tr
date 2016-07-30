package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Rating;
import com.github.jntakpe.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
