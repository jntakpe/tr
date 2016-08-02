package com.github.jntakpe.config.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * {@link AuthenticationProvider} permettant d'authentifier un utilisateur depuis la base de données
 *
 * @author jntakpe
 * @see AuthenticationProvider
 */
@Component
public class DatabaseAuthentificationProvider implements AuthenticationProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(CompositeAuthentificationProvider.class);

    private final DatabaseUserDetailsService databaseUserDetailsService;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DatabaseAuthentificationProvider(DatabaseUserDetailsService databaseUserDetailsService, PasswordEncoder passwordEncoder) {
        this.databaseUserDetailsService = databaseUserDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        UserDetails userDetails = retrieveUser(authentication);
        return authenticationFromUserDetails(userDetails, (String) authentication.getCredentials());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return true;
    }

    protected UserDetails retrieveUser(Authentication authentication) {
        return retrieveUserFromDB(authentication);
    }

    private UserDetails retrieveUserFromDB(Authentication authentication) {
        String username = authentication.getName();
        UserDetails user = databaseUserDetailsService.loadUserByUsername(username);
        databaseUserDetailsService.checkPassword(user, (String) authentication.getCredentials(), passwordEncoder);
        LOGGER.info("Utilisateur {} connecté depuis la DB", username);
        return user;
    }

    private Authentication authenticationFromUserDetails(UserDetails userDetails, String password) {
        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }
}
