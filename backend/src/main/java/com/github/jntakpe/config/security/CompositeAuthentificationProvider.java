package com.github.jntakpe.config.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * {@link AuthenticationProvider} permettant d'authentifier un utilisateur depuis le LDAP en récupérant les droits en DB
 *
 * @author jntakpe
 */
@Component
public class CompositeAuthentificationProvider implements AuthenticationProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(CompositeAuthentificationProvider.class);

    private final DatabaseUserDetailsService databaseUserDetailsService;

    @Autowired
    public CompositeAuthentificationProvider(DatabaseUserDetailsService databaseUserDetailsService) {
        this.databaseUserDetailsService = databaseUserDetailsService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String password = (String) authentication.getCredentials();
        UserDetails userDetails = retrieveUser(authentication.getName(), password);
        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return true;
    }

    private UserDetails retrieveUser(String username, String password) {
        try {
            return retrieveUserFromDB(username, password);
        } catch (UsernameNotFoundException | AccountExpiredException | BadCredentialsException e) {
            LOGGER.info("Impossible de connecter l'utilisateur depuis la DB", e);
            //TODO ici appeler le LDAP
            throw e;
        }
    }

    private UserDetails retrieveUserFromDB(String username, String password) {
        UserDetails user = databaseUserDetailsService.loadUserByUsername(username);
        databaseUserDetailsService.checkPassword(user, password);
        LOGGER.info("Utilisateur {} connecté depuis la DB", username);
        return user;
    }

    private UserDetails retrieveUserFromLdap(String username, String password) {
        return null;
    }

}
