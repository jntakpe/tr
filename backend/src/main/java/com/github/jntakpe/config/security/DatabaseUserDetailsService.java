package com.github.jntakpe.config.security;

import com.github.jntakpe.config.properties.OAuth2Properties;
import com.github.jntakpe.entity.Employee;
import com.github.jntakpe.service.EmployeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Permet de récupérer l'utilisateur a connecter depuis une base de données
 *
 * @author jntakpe
 */
@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseUserDetailsService.class);

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final EmployeeService employeeService;

    private final OAuth2Properties oAuth2Properties;

    @Autowired
    public DatabaseUserDetailsService(EmployeeService employeeService, OAuth2Properties oAuth2Properties) {
        this.employeeService = employeeService;
        this.oAuth2Properties = oAuth2Properties;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException, AccountExpiredException {
        LOGGER.info("Tentative d'authentification de l'utilisateur {} depuis la DB", username);
        return employeeService.findByLogin(username)
                .map(this::toUserIfNonExpired)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("Impossible de trouver l'utilisateur %s en DB", username)));
    }

    public void checkPassword(UserDetails user, String rawPassword) throws BadCredentialsException {
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException(String.format("Le mot de passe de l'utilisateur %s est incorrect", user.getUsername()));
        }
    }

    private SpringSecurityUser toUserIfNonExpired(Employee employee) throws AccountExpiredException {
        if (LocalDateTime.now().isAfter(employee.getLastLdapCheck().plusHours(oAuth2Properties.getLdapCheckIntervalInHours()))) {
            throw new AccountExpiredException(String.format("L'utilisateur %s doit se connecter au LDAP pour vérification de son compte",
                    employee.getLogin()));
        }
        return new SpringSecurityUser(employee);
    }

}
