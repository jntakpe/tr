package com.github.jntakpe.repository;

import com.github.jntakpe.model.Session;

/**
 * Repository gérant l'entité {@link Session}
 *
 * @author jntakpe
 */
public interface SessionRepository extends GenericRepository<Session> {

    Long countByLocation_Id(Long id);

    Long countByTraining_Id(Long id);

}
