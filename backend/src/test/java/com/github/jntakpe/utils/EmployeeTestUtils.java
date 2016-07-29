package com.github.jntakpe.utils;

import com.github.jntakpe.entity.Employee;
import com.github.jntakpe.repository.EmployeeRepository;
import com.github.jntakpe.service.CollaborateurServiceTests;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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

    public Employee findDefaultEmployee() {
        return employeeRepository.findByLoginIgnoreCase(CollaborateurServiceTests.EXISTING_LOGIN)
                .orElseThrow(() -> new IllegalStateException("No collab"));
    }

}
