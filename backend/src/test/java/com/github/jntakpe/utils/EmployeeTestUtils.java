package com.github.jntakpe.utils;

import com.github.jntakpe.model.Employee;
import com.github.jntakpe.repository.EmployeeRepository;
import com.github.jntakpe.service.EmployeeServiceTests;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public EmployeeTestUtils(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
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

}
