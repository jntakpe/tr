package com.github.jntakpe.service;

import com.github.jntakpe.entity.Employee;
import com.github.jntakpe.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        LOGGER.debug("Recherche de l'employee {}", login);
        return employeeRepository.findByLoginIgnoreCase(login);
    }

}
