package com.github.jntakpe.config.security;

import com.github.jntakpe.config.properties.OAuth2Properties;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.service.EmployeeService;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Permet de récupérer l'utilisateur a connecter depuis une base de données
 *
 * @author jntakpe
 * @see UserDetailsService
 */
@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseUserDetailsService.class);

    private final EmployeeService employeeService;

    private final OAuth2Properties oAuth2Properties;

    @Autowired
    public DatabaseUserDetailsService(EmployeeService employeeService, OAuth2Properties oAuth2Properties) {
        this.employeeService = employeeService;
        this.oAuth2Properties = oAuth2Properties;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) {
        LOGGER.info("Tentative d'authentification de l'utilisateur {} depuis la DB", username);
        return employeeService.findByLogin(username)
                .map(this::toUserIfNonExpired)
                .orElseThrow(() -> new BadCredentialsException(String.format("Impossible de trouver l'utilisateur %s en DB", username)));
    }

    public void checkPassword(UserDetails user, String rawPassword, PasswordEncoder passwordEncoder) {
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException(String.format("Le mot de passe de l'utilisateur %s est incorrect", user.getUsername()));
        }
    }

    private SpringSecurityUser toUserIfNonExpired(Employee employee) {
        if (LocalDateTime.now().isAfter(employee.getLastLdapCheck().plusHours(oAuth2Properties.getLdapCheckIntervalInHours()))) {
            throw new AccountExpiredException(String.format("L'utilisateur %s doit se connecter au LDAP pour vérification de son compte",
                    employee.getLogin()));
        }
        Hibernate.initialize(employee.getAuthorities());
        return new SpringSecurityUser(employee);
    }

}
