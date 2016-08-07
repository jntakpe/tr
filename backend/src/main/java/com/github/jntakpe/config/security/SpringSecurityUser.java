package com.github.jntakpe.config.security;

import com.github.jntakpe.model.Employee;
import org.springframework.security.core.userdetails.User;

import java.util.Objects;

/**
 * {@link User} utilisé par Spring Security pour garder les informations sur l'utilisateur connecté
 *
 * @author jntakpe
 */
public class SpringSecurityUser extends User {

    public static final String ROLE_PREFIX = "ROLE_";

    private Long id;

    private String email;

    private String firstName;

    private String lastName;

    private String department;

    private String phone;

    private String location;

    public SpringSecurityUser(Employee employee) {
        super(employee.getLogin(), employee.getPassword(), SecurityUtils.authoritiesToSimpleGrant(employee.getAuthorities()));
        this.id = employee.getId();
        this.email = employee.getEmail();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.department = employee.getDepartment();
        this.phone = employee.getPhone();
        this.location = employee.getLocation();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        SpringSecurityUser user = (SpringSecurityUser) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id);
    }

}
