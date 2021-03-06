package com.github.jntakpe.service;

import com.github.jntakpe.config.security.SecurityUtils;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Rating;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.repository.RatingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
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

    private final EmployeeService employeeService;

    private final SessionService sessionService;

    @Autowired
    public RatingService(RatingRepository ratingRepository, EmployeeService employeeService, SessionService sessionService) {
        this.ratingRepository = ratingRepository;
        this.employeeService = employeeService;
        this.sessionService = sessionService;
    }

    @Transactional(readOnly = true)
    public List<Rating> findBySessionId(Long sessionId) {
        LOGGER.debug("Recherche de toutes les notes de la session id {}", sessionId);
        return ratingRepository.findBySession_Id(sessionId);
    }

    @Transactional
    //TODO Only for admins
    public Rating register(Long sessionId, Employee employee) {
        Rating rating = new Rating();
        addSessionFromIdIfExist(sessionId, rating);
        addEmployeeFromLogin(employee.getLogin(), rating);
        checkSessionAndEmployeeAvailable(rating);
        LOGGER.info("Inscription de l'utilisateur {} à la session id {}", employee, sessionId);
        return ratingRepository.save(rating);
    }

    @Transactional
    public Rating rate(Long sessionId, Rating rating) {
        Objects.requireNonNull(rating);
        addSessionFromIdIfExist(sessionId, rating);
        checkRatingHasId(rating);
        checkEmployeeIsAuthenticatedUser(rating);
        checkSessionAndEmployeeAvailable(rating);
        LOGGER.info("{} d'une note pour la session id {}", rating.isNew() ? "Création" : "Modification", rating.getSession().getId());
        return ratingRepository.save(rating);
    }

    @Transactional
    public void unregister(Long sessionId, Long ratingId) {
        Rating rating = findById(ratingId);
        addSessionFromIdIfExist(sessionId, rating);
        LOGGER.info("Désincription de l'employee {} de la session id {}", rating.getEmployee(), rating.getSession());
        ratingRepository.delete(rating);
    }

    private Rating findById(Long id) {
        Optional<Rating> opt = Optional.ofNullable(ratingRepository.findOne(id));
        return opt.orElseThrow(() -> new EntityNotFoundException(String.format("Impossible de trouver une note ayant l'id %s", id)));
    }

    private void addSessionFromIdIfExist(Long sessionId, Rating rating) {
        Session session = sessionService.findById(sessionId);
        rating.setSession(session);
    }

    private void checkEmployeeIsAuthenticatedUser(Rating rating) {
        Rating attachedRating = findById(rating.getId());
        if (!SecurityUtils.getCurrentUserOrThrow().getId().equals(attachedRating.getEmployee().getId())) {
            throw new ValidationException("Vous ne pouvez pas noter la session d'un autre participant");
        }
    }

    private void addEmployeeFromLogin(String login, Rating rating) {
        Employee employee = employeeService.findByLogin(login)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Impossible de trouver l'utilisateur %s", login)));
        rating.setEmployee(employee);
    }

    private void checkRatingHasId(Rating rating) {
        if (rating.getId() == null) {
            throw new ValidationException("Vous ne pouvez pas noter une session à laquelle vous n'êtes pas inscrit(e)");
        }
    }

    private void checkSessionAndEmployeeAvailable(Rating rating) {
        Optional<Rating> opt = ratingRepository.findBySessionAndEmployee(rating.getSession(), rating.getEmployee());
        if (opt.isPresent() && !opt.get().getId().equals(rating.getId())) {
            String msg = String.format("Une note a déjà été attribuée pour la session %s", rating.getSession().getId());
            throw new ValidationException(msg);
        }
    }
}
