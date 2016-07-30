package com.github.jntakpe.service;

import com.github.jntakpe.config.security.SecurityUtils;
import com.github.jntakpe.entity.Employee;
import com.github.jntakpe.entity.Rating;
import com.github.jntakpe.entity.Session;
import com.github.jntakpe.repository.RatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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

    @Transactional
    public Rating save(Rating rating, Long sessionId) {
        Objects.requireNonNull(rating);
        addSessionFromId(rating, sessionId);
        addEmployeeFromAuthenticatedUser(rating);
        checkSessionAndEmployeeAvailable(rating);
        LOGGER.info("{} d'une note pour la session id {}", rating.isNew() ? "Création" : "Modification", rating.getSession().getId());
        return ratingRepository.save(rating);
    }

    private void addSessionFromId(Rating rating, Long sessionId) {
        Session session = new Session();
        session.setId(sessionId);
        rating.setSession(session);
    }

    private void addEmployeeFromAuthenticatedUser(Rating rating) {
        Employee employee = new Employee();
        employee.setId(SecurityUtils.getCurrentUserId());
        rating.setEmployee(employee);
    }

    private void checkSessionAndEmployeeAvailable(Rating rating) {
        Optional<Rating> opt = ratingRepository.findBySessionAndEmployee(rating.getSession(), rating.getEmployee());
        if (opt.isPresent() && !opt.get().getId().equals(rating.getId())) {
            String msg = String.format("Une note a déjà été attribuée pour la session %s", rating.getSession().getId());
            throw new ValidationException(msg);
        }
    }
}
