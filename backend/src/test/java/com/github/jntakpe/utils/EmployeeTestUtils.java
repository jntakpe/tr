package com.github.jntakpe.utils;

import com.github.jntakpe.model.Employee;
import com.github.jntakpe.repository.EmployeeRepository;
import com.github.jntakpe.service.EmployeeServiceTests;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Optional;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Employee}
 *
 * @author jntakpe
 */
@Component
public class EmployeeTestUtils {

    private final EmployeeRepository employeeRepository;

    private final JdbcTemplate jdbcTemplate;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public EmployeeTestUtils(EmployeeRepository employeeRepository, JdbcTemplate jdbcTemplate) {
        this.employeeRepository = employeeRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public Employee findDefaultEmployee() {
        return employeeRepository.findByLoginIgnoreCase(EmployeeServiceTests.EXISTING_LOGIN)
                .orElseThrow(() -> new IllegalStateException("No collab"));
    }

    @Transactional(readOnly = true)
    public Employee findDefaultEmployeeWithAuthories() {
        Employee employee = findDefaultEmployee();
        Hibernate.initialize(employee.getAuthorities());
        return employee;
    }

    @Transactional(readOnly = true)
    public Employee findById(Long id) {
        return employeeRepository.findOne(id);
    }

    @Transactional(readOnly = true)
    public Optional<Employee> findByLogin(String login) {
        return employeeRepository.findByLoginIgnoreCase(login);
    }

    public void detach(Employee employee) {
        entityManager.detach(employee);
    }

    @Transactional(readOnly = true)
    public Long countTrainers() {
        String query = "SELECT count(DISTINCT employee.id) FROM employee INNER JOIN session ON employee.id = session.trainer_id";
        return jdbcTemplate.queryForObject(query, Long.class);
    }
}
