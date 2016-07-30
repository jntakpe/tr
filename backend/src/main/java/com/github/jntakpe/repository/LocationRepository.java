package com.github.jntakpe.repository;

import com.github.jntakpe.entity.Location;

import java.util.Optional;

/**
 * Repository gérant l'entité {@link Location}
 *
 * @author jntakpe
 */
public interface LocationRepository extends GenericRepository<Location> {

    Optional<Location> findByNameAndCityAllIgnoreCase(String name, String city);

}
