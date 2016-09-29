package com.github.jntakpe.service;

import com.github.jntakpe.model.IdentifiableEntity;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.repository.SessionPredicates;
import com.github.jntakpe.repository.SessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.github.jntakpe.service.EmployeeService.TRAINERS_CACHE;

/**
 * Services associés à l'entité {@link Session}
 *
 * @author jntakpe
 */
@Service
public class SessionService {

    private static final String SESSIONS_CACHE = "sessions";

    private static final String COUNT_LOCATIONS_CACHE = "session-count-locations";

    private static final String COUNT_TRAININGS_CACHE = "session-count-trainings";

    private static final String LOCATIONS_CACHE = "session-locations";

    private static final String TRAININGS_CACHE = "session-trainings";

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionService.class);

    private SessionRepository sessionRepository;

    @Autowired
    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Transactional
    @CacheEvict(allEntries = true,
            cacheNames = {SESSIONS_CACHE, COUNT_TRAININGS_CACHE, COUNT_LOCATIONS_CACHE, LOCATIONS_CACHE, TRAININGS_CACHE, TRAINERS_CACHE})
    public Session save(Session session) {
        Objects.requireNonNull(session);
        LOGGER.info("{} de la session {}", session.isNew() ? "Création" : "Modification", session);
        return sessionRepository.save(session);
    }

    @Transactional
    @CacheEvict(allEntries = true,
            cacheNames = {SESSIONS_CACHE, COUNT_TRAININGS_CACHE, COUNT_LOCATIONS_CACHE, LOCATIONS_CACHE, TRAININGS_CACHE, TRAINERS_CACHE})
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
    @Cacheable(COUNT_LOCATIONS_CACHE)
    public Long countByLocationId(Long id) {
        return sessionRepository.countByLocation_Id(id);
    }

    @Transactional(readOnly = true)
    @Cacheable(COUNT_TRAININGS_CACHE)
    public Long countByTrainingId(Long id) {
        return sessionRepository.countByTraining_Id(id);
    }

    @Cacheable(LOCATIONS_CACHE)
    @Transactional(readOnly = true)
    public List<Session> findByLocationId(Long id) {
        LOGGER.debug("Recherche des sessions pour le site de formation {}", id);
        return sessionRepository.findByLocation_Id(id);
    }

    @Cacheable(TRAININGS_CACHE)
    @Transactional(readOnly = true)
    public List<Session> findByTrainingId(Long id) {
        LOGGER.debug("Recherche des sessions pour la formation {}", id);
        return sessionRepository.findByTraining_Id(id);
    }

    @Transactional(readOnly = true)
    public Page<Session> findWithPredicate(Pageable pageable, Session session) {
        LOGGER.debug("Recherche des sessions de la page : {}", pageable);
        // TODO Pourra être fait en un appel quand la PR https://github.com/spring-projects/spring-data-jpa/pull/182
        Page<Session> page = sessionRepository.findAll(SessionPredicates.withSession(session), pageable);
        Map<Long, Session> idsMap = page.map(IdentifiableEntity::getId).getContent().stream()
                .map(id -> sessionRepository.findById(id))
                .collect(Collectors.toMap(IdentifiableEntity::getId, Function.identity()));
        return page.map(s -> idsMap.get(s.getId()));
    }

}
