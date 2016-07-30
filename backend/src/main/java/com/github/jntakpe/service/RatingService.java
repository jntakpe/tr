package com.github.jntakpe.service;

import com.github.jntakpe.entity.Rating;
import com.github.jntakpe.repository.RatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Services associés à l'entité {@link Rating}
 *
 * @author jntakpe
 */
@Service
public class RatingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(RatingService.class);

    private final RatingRepository ratingRepository;

    @Autowired
    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    @Transactional(readOnly = true)
    public List<Rating> findBySessionId(Long sessionId) {
        LOGGER.debug("Recherche de toutes les notes de la session id {}", sessionId);
        return ratingRepository.findBySession_Id(sessionId);
    }
}
