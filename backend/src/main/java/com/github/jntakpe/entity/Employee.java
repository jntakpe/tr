package com.github.jntakpe.entity;

import org.hibernate.validator.constraints.Email;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.util.Objects;

/**
 * Entité représentant un employé de Sopra Steria
 *
 * @author jntakpe
 */
@Entity
public class Employee extends AuditingEntity {

    @NotNull
    @Column(unique = true, nullable = false)
    private String login;

    private String firstName;

    private String lastName;

    @Email
    @Column(unique = true)
    private String email;

    public Employee() {
    }

    public Employee(String login) {
        setLogin(login);
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        if (Objects.nonNull(login)) {
            this.login = login.toLowerCase();
        }
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Employee employee = (Employee) o;

        return login.equals(employee.login);
    }

    @Override
    public int hashCode() {
        return login.hashCode();
    }


}
