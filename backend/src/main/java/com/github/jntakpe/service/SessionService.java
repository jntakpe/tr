package com.github.jntakpe.service;

import com.github.jntakpe.model.Session;
import com.github.jntakpe.repository.SessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Objects;

/**
 * Services associés à l'entité {@link Session}
 *
 * @author jntakpe
 */
@Service
public class SessionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionService.class);

    private SessionRepository sessionRepository;

    @Autowired
    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Transactional(readOnly = true)
    public List<Session> findAll() {
        LOGGER.debug("Recherche de toutes les sessions");
        return sessionRepository.findAll();
    }

    @Transactional
    public Session save(Session session) {
        Objects.requireNonNull(session);
        LOGGER.info("{} de la session {}", session.isNew() ? "Création" : "Modification", session);
        return sessionRepository.save(session);
    }

    @Transactional
    public void delete(Long id) {
        Session session = findById(id);
        LOGGER.info("Suppression de la session de formation {}", session);
        sessionRepository.delete(session);
    }

    @Transactional(readOnly = true)
    public Session findById(Long id) {
        Objects.requireNonNull(id);
        Session session = sessionRepository.findOne(id);
        if (session == null) {
            LOGGER.warn("Aucune session de formation possédant l'id {}", id);
            throw new EntityNotFoundException(String.format("Aucune session de formation possédant l'id %s", id));
        }
        return session;
    }

    @Transactional(readOnly = true)
    public Long countByLocationId(Long id) {
        return sessionRepository.countByLocation_Id(id);
    }

}
