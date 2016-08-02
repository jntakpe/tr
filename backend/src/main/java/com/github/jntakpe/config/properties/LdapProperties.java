package com.github.jntakpe.config.properties;

import com.github.jntakpe.config.ProfileConstants;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

/**
 * Propriétés du LDAP
 *
 * @author jntakpe
 */
@Component
@Profile(ProfileConstants.PROD)
@ConfigurationProperties("ldap")
public class LdapProperties {

    @NotNull
    private String url;

    @Valid
    private Browsing browsing;

    @Valid
    private Users users;

    @Valid
    private Attributes attributes;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Browsing getBrowsing() {
        return browsing;
    }

    public void setBrowsing(Browsing browsing) {
        this.browsing = browsing;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Attributes getAttributes() {
        return attributes;
    }

    public void setAttributes(Attributes attributes) {
        this.attributes = attributes;
    }

    public static class Browsing {

        @NotNull
        private String userDN;

        @NotNull
        private String password;

        public String getUserDN() {
            return userDN;
        }

        public void setUserDN(String userDN) {
            this.userDN = userDN;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class Users {

        @NotNull
        private String base;

        @NotNull
        private String search;

        public String getBase() {
            return base;
        }

        public void setBase(String base) {
            this.base = base;
        }

        public String getSearch() {
            return search;
        }

        public void setSearch(String search) {
            this.search = search;
        }
    }

    public static class Attributes {

        @NotNull
        private String login;

        @NotNull
        private String fisrtName;

        @NotNull
        private String lastName;

        @NotNull
        private String email;

        @NotNull
        private String location;

        @NotNull
        private String department;

        @NotNull
        private String phone;

        public String getLogin() {
            return login;
        }

        public void setLogin(String login) {
            this.login = login;
        }

        public String getFisrtName() {
            return fisrtName;
        }

        public void setFisrtName(String fisrtName) {
            this.fisrtName = fisrtName;
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

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
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
    }

}
