package com.github.jntakpe.repository;

import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Rating;
import com.github.jntakpe.model.Session;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

/**
 * Repository gérant l'entité {@link Rating}
 *
 * @author jntakpe
 */
public interface RatingRepository extends GenericRepository<Rating> {

    List<Rating> findBySession_Id(Long sessionId);

    @EntityGraph(value = "Rating.session", type = EntityGraph.EntityGraphType.FETCH)
    List<Rating> findByEmployee_id(Long employeeId);

    Long countBySession_Id(Long sessionId);

    Optional<Rating> findBySessionAndEmployee(Session session, Employee employee);

}
