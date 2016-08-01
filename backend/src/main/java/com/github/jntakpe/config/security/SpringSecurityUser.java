package com.github.jntakpe.config.security;

import com.github.jntakpe.entity.Authority;
import com.github.jntakpe.entity.Employee;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;
import java.util.List;
import java.util.Set;

/**
 * {@link User} utilisé par Spring Security pour garder les informations sur l'utilisateur connecté
 *
 * @author jntakpe
 */
public class SpringSecurityUser extends User {

    private Long id;

    private String password;

    private String email;

    private String firstName;

    private String lastName;

    private String department;

    private String phone;

    private String location;

    public SpringSecurityUser(Employee employee) {
        super(employee.getLogin(), employee.getPassword(), authoritiesToSimpleGrant(null));
        this.id = employee.getId();
        this.email = employee.getEmail();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.department = employee.getDepartment();
        this.phone = employee.getPhone();
        this.location = employee.getLocation();
    }

    public static List<SimpleGrantedAuthority> authoritiesToSimpleGrant(Set<Authority> authorities) {
        //TODO to implement
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

}
