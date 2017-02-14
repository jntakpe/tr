package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    //not tested
    @GetMapping(UriConstants.EMPLOYEES_LOGIN)
    public ResponseEntity<Employee> findByLogin(@PathVariable String login) {
        return employeeService.findByLogin(login).map(e -> new ResponseEntity<>(e, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping(UriConstants.EMPLOYEES_LOGIN_START)
    public List<Employee> findStartingByLogin(@PathVariable String login) {
        return employeeService.findStartingByLogin(login);
    }

    @GetMapping(UriConstants.ID + "/sessions")
    public List<Session> findSessions(@PathVariable Long id) {
        return employeeService.findSessionsByEmployeeId(id);
    }
}
