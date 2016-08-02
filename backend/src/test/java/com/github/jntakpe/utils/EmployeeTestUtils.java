package com.github.jntakpe.utils;

import com.github.jntakpe.model.Employee;
import com.github.jntakpe.repository.EmployeeRepository;
import com.github.jntakpe.service.EmployeeServiceTests;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Employee}
 *
 * @author jntakpe
 */
@Component
public class EmployeeTestUtils {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeTestUtils(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public Employee findDefaultEmployee() {
        return employeeRepository.findByLoginIgnoreCase(EmployeeServiceTests.EXISTING_LOGIN)
                .orElseThrow(() -> new IllegalStateException("No collab"));
    }

}
