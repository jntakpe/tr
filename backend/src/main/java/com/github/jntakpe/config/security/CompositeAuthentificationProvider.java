package com.github.jntakpe.config.security;

import com.github.jntakpe.config.ProfileConstants;
import com.github.jntakpe.mapper.LdapEmployeeMapper;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.service.EmployeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.ldap.authentication.LdapAuthenticator;
import org.springframework.stereotype.Component;

/**
 * {@link AuthenticationProvider} permettant d'authentifier un utilisateur depuis le LDAP en récupérant les droits en DB
 *
 * @author jntakpe
 * @see DatabaseAuthentificationProvider
 */
@Component
@Profile(ProfileConstants.PROD)
public class CompositeAuthentificationProvider extends DatabaseAuthentificationProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(CompositeAuthentificationProvider.class);

    private final LdapAuthenticator ldapAuthenticator;

    private final LdapEmployeeMapper ldapEmployeeMapper;

    private final EmployeeService employeeService;

    public CompositeAuthentificationProvider(DatabaseUserDetailsService databaseUserDetailsService,
                                             LdapAuthenticator ldapAuthenticator,
                                             LdapEmployeeMapper ldapEmployeeMapper,
                                             EmployeeService employeeService) {
        super(databaseUserDetailsService);
        this.ldapAuthenticator = ldapAuthenticator;
        this.ldapEmployeeMapper = ldapEmployeeMapper;
        this.employeeService = employeeService;
    }

    @Override
    protected UserDetails retrieveUser(Authentication authentication) {
        try {
            return super.retrieveUser(authentication);
        } catch (UsernameNotFoundException | AccountExpiredException | BadCredentialsException e) {
            LOGGER.info("Impossible de connecter l'utilisateur {} depuis la DB", authentication.getName());
            try {
                return retrieveUserFromLdap(authentication);
            } catch (BadCredentialsException bce) {
                LOGGER.warn("Impossible de connecteur l'utilisateur {} depuis le LDAP", authentication.getName());
                throw bce;
            }
        }
    }

    private UserDetails retrieveUserFromLdap(Authentication authentication) {
        DirContextOperations ctx = ldapAuthenticator.authenticate(authentication);
        Employee ldapEmployee = ldapEmployeeMapper.map(ctx);
        ldapEmployee.setPassword(passwordEncoder.encode((CharSequence) authentication.getCredentials()));
        Employee employee = employeeService.saveFromLdap(ldapEmployee);
        return new SpringSecurityUser(employee);
    }

}
