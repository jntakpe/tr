package com.github.jntakpe.repository;

import com.github.jntakpe.entity.Employee;

import java.util.Optional;

/**
 * Repository gérant l'entité {@link Employee}
 *
 * @author jntakpe
 */
public interface EmployeeRepository extends GenericRepository<Employee> {

    Optional<Employee> findByLoginIgnoreCase(String login);

}
