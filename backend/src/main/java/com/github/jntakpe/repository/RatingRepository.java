package com.github.jntakpe.repository;

import com.github.jntakpe.entity.Rating;

import java.util.List;

/**
 * Repository gérant l'entité {@link Rating}
 *
 * @author jntakpe
 */
public interface RatingRepository extends GenericRepository<Rating> {

    List<Rating> findBySession_Id(Long sessionId);

}
