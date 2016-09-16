package com.github.jntakpe.utils;

import com.github.jntakpe.config.security.SecurityUtils;
import com.github.jntakpe.config.security.SpringSecurityUser;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Rating;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.repository.RatingRepository;
import org.hibernate.Hibernate;
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

    private final SessionTestsUtils sessionTestsUtils;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public RatingTestsUtils(RatingRepository ratingRepository, EmployeeTestUtils employeeTestUtils, SessionTestsUtils sessionTestsUtils) {
        this.ratingRepository = ratingRepository;
        this.employeeTestUtils = employeeTestUtils;
        this.sessionTestsUtils = sessionTestsUtils;
    }

    @Transactional(readOnly = true)
    public Rating findAnyRating() {
        return ratingRepository.findAll().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("no rating"));
    }

    @Transactional(readOnly = true)
    public Rating findAnyRatingInitialized() {
        Rating rating = ratingRepository.findAll().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("no rating"));
        Hibernate.initialize(rating.getSession());
        Hibernate.initialize(rating.getEmployee());
        return rating;
    }

    @Transactional(readOnly = true)
    public Rating findAnyRatingForConnectedUser() {
        SpringSecurityUser user = SecurityUtils.getCurrentUserOrThrow();
        Long employeeId = user.getId();
        return employeeTestUtils.findById(employeeId).getRatings().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("no rating for user  " + user.getUsername()));
    }

    @Transactional(readOnly = true)
    public Rating findAnyRatingForUser(String login) {
        Employee employee = employeeTestUtils.findByLogin(login)
                .orElseThrow(() -> new IllegalStateException("No employee for login " + login));
        return employee.getRatings().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("no rating for user  " + employee.getLogin()));
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
                .peek(r -> Hibernate.initialize(r.getSession()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Employee findAnyDetachedEmployee() {
        Employee defaultEmployee = employeeTestUtils.findDefaultEmployee();
        employeeTestUtils.detach(defaultEmployee);
        return defaultEmployee;
    }

    @Transactional(readOnly = true)
    public Session findUnusedDetachedSession() {
        Session unusedSession = sessionTestsUtils.findUnusedSession();
        sessionTestsUtils.detach(unusedSession);
        return unusedSession;
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
