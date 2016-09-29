package com.github.jntakpe.repository;

import com.github.jntakpe.model.Employee;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * Repository gérant l'entité {@link Employee}
 *
 * @author jntakpe
 */
public interface EmployeeRepository extends GenericRepository<Employee> {

    Optional<Employee> findByLoginIgnoreCase(String login);

    @Query("select distinct e from Session s inner join s.trainer e")
    List<Employee> findAllTrainers();

}
