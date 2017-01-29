package com.github.jntakpe.repository;

import com.github.jntakpe.model.Session;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

/**
 * Repository gérant l'entité {@link Session}
 *
 * @author jntakpe
 */
public interface SessionRepository extends GenericRepository<Session> {

    Long countByLocation_Id(Long id);

    Long countByTraining_Id(Long id);

    @EntityGraph(value = "Session.detail", type = EntityGraph.EntityGraphType.FETCH)
    List<Session> findByLocation_Id(Long id);

    @EntityGraph(value = "Session.detail", type = EntityGraph.EntityGraphType.FETCH)
    List<Session> findByTraining_Id(Long id);

    @EntityGraph(value = "Session.detail", type = EntityGraph.EntityGraphType.FETCH)
    Optional<Session> findById(Long id);

}
