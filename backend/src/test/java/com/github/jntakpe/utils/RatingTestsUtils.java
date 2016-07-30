package com.github.jntakpe.utils;

import com.github.jntakpe.entity.Rating;
import com.github.jntakpe.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Rating}
 *
 * @author jntakpe
 */
@Component
public class RatingTestsUtils {

    private final RatingRepository ratingRepository;

    @Autowired
    public RatingTestsUtils(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }
}
