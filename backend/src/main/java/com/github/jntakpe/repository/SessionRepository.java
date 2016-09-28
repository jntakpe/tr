package com.github.jntakpe.repository;

import com.github.jntakpe.model.Session;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Collection;
import java.util.List;

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
    List<Session> findByIdIn(Collection<Long> ids);

}
