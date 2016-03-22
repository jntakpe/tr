package com.github.jntakpe.repository;

import com.github.jntakpe.entity.Training;

import java.util.Optional;

/**
 * Repository gérant l'entité {@link Training}
 *
 * @author jntakpe
 */
public interface TrainingRepository extends GenericRepository<Training> {

    Optional<Training> findByNameIgnoreCase(String name);

}
