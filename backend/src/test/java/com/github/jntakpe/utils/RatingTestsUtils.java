package com.github.jntakpe.utils;

import com.github.jntakpe.model.Rating;
import com.github.jntakpe.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Rating}
 *
 * @author jntakpe
 */
@Component
public class RatingTestsUtils {

    private final RatingRepository ratingRepository;

    private final EmployeeTestUtils employeeTestUtils;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public RatingTestsUtils(RatingRepository ratingRepository, EmployeeTestUtils employeeTestUtils) {
        this.ratingRepository = ratingRepository;
        this.employeeTestUtils = employeeTestUtils;
    }

    @Transactional(readOnly = true)
    public Rating findAnyRating() {
        return ratingRepository.findAll().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("no rating"));
    }

    @Transactional(readOnly = true)
    public Long findExistingSessionId() {
        return ratingRepository.findAll().stream()
                .findAny()
                .map(r -> r.getSession().getId())
                .orElseThrow(() -> new IllegalStateException("no rating"));
    }

    @Transactional(readOnly = true)
    public List<Rating> findRatingsWithEmployeeId(Long employeeId) {
        return ratingRepository.findAll().stream()
                .filter(r -> r.getEmployee().getId().equals(employeeId))
                .collect(Collectors.toList());
    }

    public void detach(Rating rating) {
        entityManager.detach(rating);
    }

    public void flush() {
        ratingRepository.flush();
    }

    public Rating newRating() {
        Rating rating = new Rating();
        rating.setAnimation(3);
        rating.setDocumentation(3);
        rating.setExercices(3);
        rating.setSubject(3);
        rating.setPratice(3);
        rating.setTheory(3);
        rating.setPros("Perfect training");
        rating.setCons("None");
        return rating;
    }

}
