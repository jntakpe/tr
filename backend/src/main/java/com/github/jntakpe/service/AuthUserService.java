package com.github.jntakpe.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Services associés à l'authentification d'un utilisateur
 *
 * @author jntakpe
 */
@Service
public class AuthUserService implements UserDetailsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthUserService.class);

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LOGGER.info("Authentification de l'utilisateur {}", username);
        return new User("test", passwordEncoder.encode("test"), Collections.singleton(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }

}
