package com.github.jntakpe.repository;

import com.github.jntakpe.model.AuditingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;

/**
 * Publication des méthodes génériques de gestion des repositories des entités de type {@link AuditingEntity}
 *
 * @author jntakpe
 */
public interface GenericRepository<T extends AuditingEntity> extends JpaRepository<T, Long>, QueryDslPredicateExecutor<T> {

}
