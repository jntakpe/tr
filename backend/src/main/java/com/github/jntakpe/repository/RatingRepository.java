package com.github.jntakpe.repository;

import com.github.jntakpe.entity.Employee;
import com.github.jntakpe.entity.Rating;
import com.github.jntakpe.entity.Session;

import java.util.List;
import java.util.Optional;

/**
 * Repository gérant l'entité {@link Rating}
 *
 * @author jntakpe
 */
public interface RatingRepository extends GenericRepository<Rating> {

    List<Rating> findBySession_Id(Long sessionId);

    Optional<Rating> findBySessionAndEmployee(Session session, Employee employee);

}
