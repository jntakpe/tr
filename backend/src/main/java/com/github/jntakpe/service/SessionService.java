package com.github.jntakpe.service;

import com.github.jntakpe.model.Session;
import com.github.jntakpe.repository.SessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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

    public static final String COLLECTION_CACHE_NAME = "sessions";

    public static final String ENTIY_CACHE_NAME = "session";

    public static final String COUNT_TRAININGS_CACHE_NAME = "session-count-training";

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionService.class);

    private SessionRepository sessionRepository;

    @Autowired
    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Cacheable(COLLECTION_CACHE_NAME)
    @Transactional(readOnly = true)
    public List<Session> findAll() {
        LOGGER.debug("Recherche de toutes les sessions");
        return sessionRepository.findAll();
    }

    @Transactional
    @CacheEvict(cacheNames = {COLLECTION_CACHE_NAME, ENTIY_CACHE_NAME, COUNT_TRAININGS_CACHE_NAME}, allEntries = true)
    public Session save(Session session) {
        Objects.requireNonNull(session);
        LOGGER.info("{} de la session {}", session.isNew() ? "Création" : "Modification", session);
        return sessionRepository.save(session);
    }

    @Transactional
    @CacheEvict(cacheNames = {COLLECTION_CACHE_NAME, ENTIY_CACHE_NAME, COUNT_TRAININGS_CACHE_NAME}, allEntries = true)
    public void delete(Long id) {
        Session session = findById(id);
        LOGGER.info("Suppression de la session de formation {}", session);
        sessionRepository.delete(session);
    }

    @Cacheable(ENTIY_CACHE_NAME)
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
    @Cacheable(COUNT_TRAININGS_CACHE_NAME)
    public Long countByLocationId(Long id) {
        return sessionRepository.countByLocation_Id(id);
    }

}
