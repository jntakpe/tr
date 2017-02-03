package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Publication de la resource {@link com.github.jntakpe.model.Employee}
 *
 * @author jntakpe
 */
@RestController
@RequestMapping(UriConstants.EMPLOYEES)
public class EmployeeResource {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeResource(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/login/{login}")
    public List<Employee> findStartingByLogin(@PathVariable String login) {
        return employeeService.findStartingByLogin(login);
    }
}
