package com.github.jntakpe.service;

import com.github.jntakpe.model.Employee;
import com.github.jntakpe.repository.EmployeeRepository;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

/**
 * Services associés à l'entité {@link Employee}
 *
 * @author jntakpe
 */
@Service
public class EmployeeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeService.class);

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public Optional<Employee> findByLogin(String login) {
        LOGGER.debug("Recherche de l'employé {}", login);
        return employeeRepository.findByLoginIgnoreCase(login);
    }

    @Transactional
    public Employee saveFromLdap(Employee employee) {
        LOGGER.info("Mise à jour de l'employé {} depuis le LDAP", employee.getLogin());
        employee.setLastLdapCheck(LocalDateTime.now());
        findByLogin(employee.getLogin()).ifPresent(e -> employee.setId(e.getId()));
        return employeeRepository.save(employee);
    }

    @Transactional(readOnly = true)
    public Employee findByIdWithAuthorities(Long id) {
        Employee employee = findById(id);
        Hibernate.initialize(employee.getAuthorities());
        return employee;
    }

    @Transactional(readOnly = true)
    private Employee findById(Long id) {
        Objects.requireNonNull(id);
        Employee employee = employeeRepository.findOne(id);
        if (employee == null) {
            LOGGER.warn("Aucun employée possédant l'id {}", id);
            throw new EntityNotFoundException(String.format("Aucun employée possédant l'id %s", id));
        }
        return employee;
    }

}
