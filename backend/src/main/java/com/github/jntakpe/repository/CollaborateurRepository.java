package com.github.jntakpe.repository;

import com.github.jntakpe.entity.Collaborateur;

import java.util.Optional;

/**
 * Repository gérant l'entité {@link Collaborateur}
 *
 * @author jntakpe
 */
public interface CollaborateurRepository extends GenericRepository<Collaborateur> {

    Optional<Collaborateur> findByLoginIgnoreCase(String login);

}
