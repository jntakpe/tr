package com.github.jntakpe.service;

import com.github.jntakpe.entity.Rating;
import com.github.jntakpe.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Services associés à l'entité {@link Rating}
 *
 * @author jntakpe
 */
@Service
public class RatingService {

    private final RatingRepository ratingRepository;

    @Autowired
    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

}
