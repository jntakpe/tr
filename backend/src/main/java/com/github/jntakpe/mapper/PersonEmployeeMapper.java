package com.github.jntakpe.mapper;

import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Person;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

/**
 * Mapper transformant une {@link Person} récupérée depuis le LDAP en {@link Employee} persisté en DB
 *
 * @author jntakpe
 */
public class PersonEmployeeMapper {

    private final PasswordEncoder passwordEncoder;

    public PersonEmployeeMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public Employee map(Person input, String password) {
        Employee employee = new Employee();
        employee.setLogin(input.getLogin());
        employee.setEmail(input.getEmail());
        employee.setFirstName(input.getFirstName());
        employee.setLastName(input.getLastName());
        employee.setLocation(input.getLocation());
        employee.setDepartment(input.getDepartment());
        employee.setPhone(input.getPhone());
        employee.setPassword(passwordEncoder.encode(password));
        return employee;
    }

    public Employee map(Person input, Employee employee, String password) {
        employee.setLogin(input.getLogin());
        employee.setEmail(input.getEmail());
        employee.setFirstName(input.getFirstName());
        employee.setLastName(input.getLastName());
        employee.setLocation(input.getLocation());
        employee.setDepartment(input.getDepartment());
        employee.setPhone(input.getPhone());
        employee.setPassword(passwordEncoder.encode(password));
        employee.setLastLdapCheck(LocalDateTime.now());
        return employee;
    }
}
