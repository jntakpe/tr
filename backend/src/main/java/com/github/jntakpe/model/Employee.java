package com.github.jntakpe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.Email;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Entité représentant un employé de Sopra Steria
 *
 * @author jntakpe
 * @see AuditingEntity
 */
@Entity
public class Employee extends AuditingEntity {

    @OneToMany(mappedBy = "employee")
    public Set<Rating> ratings = new HashSet<>();

    @NotNull
    @Column(unique = true, nullable = false)
    private String login;

    @Email
    @NotNull
    @Column(unique = true, nullable = false)
    private String email;

    private String firstName;

    private String lastName;

    private String department;

    private String phone;

    private String location;

    @JsonIgnore
    private String password;

    @JsonIgnore
    private LocalDateTime lastLdapCheck = LocalDateTime.now();

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        if (Objects.nonNull(login)) {
            this.login = login.toLowerCase();
        }
        this.login = login;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (Objects.nonNull(email)) {
            this.email = email.toLowerCase();
        }
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getLastLdapCheck() {
        return lastLdapCheck;
    }

    public void setLastLdapCheck(LocalDateTime lastLdapCheck) {
        this.lastLdapCheck = lastLdapCheck;
    }

    public Set<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        this.ratings = ratings;
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
