package com.github.jntakpe.service;

import com.github.jntakpe.entity.Session;
import com.github.jntakpe.repository.SessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public Session save(Session session) {
        LOGGER.info("{} de la session {}", session.isNew() ? "Création" : "Modification", session);
        return sessionRepository.save(session);
    }

}
