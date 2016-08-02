package com.github.jntakpe.model;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.ldap.odm.annotations.Attribute;

import javax.naming.Name;
import javax.persistence.Id;
import java.util.Objects;

/**
 * Entité représentant une personne récupérée depuis le LDAP
 *
 * @author jntakpe
 */
public class Person {

    @Id
    private Name name;

    @Attribute(name = "sAMAccountName")
    private String login;

    private String email;

    @Attribute(name = "givenname")
    private String firstName;

    @Attribute(name = "sn")
    private String lastName;

    private String department;

    @Attribute(name = "telephoneNumber")
    private String phone;

    @Attribute(name = "l")
    private String location;

    public Name getName() {
        return name;
    }

    public void setName(Name name) {
        this.name = name;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
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
        if (!(o instanceof Person)) {
            return false;
        }
        Person person = (Person) o;
        return Objects.equals(login, person.login);
    }

    @Override
    public int hashCode() {
        return Objects.hash(login);
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("login", login)
                .append("firstName", firstName)
                .append("lastName", lastName)
                .toString();
    }
}
