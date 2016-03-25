package com.github.jntakpe.repository;

import com.github.jntakpe.entity.AuditingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * Publication des méthodes génériques de gestion des repositories des entités de type {@link AuditingEntity}
 *
 * @author jntakpe
 */
@NoRepositoryBean
public interface GenericRepository<T extends AuditingEntity> extends JpaRepository<T, Long> {

}
