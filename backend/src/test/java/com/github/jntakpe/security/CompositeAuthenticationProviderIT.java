package com.github.jntakpe.security;

import com.github.jntakpe.config.ProfileConstants;
import com.github.jntakpe.config.security.CompositeAuthentificationProvider;
import com.github.jntakpe.config.security.SpringSecurityUser;
import com.github.jntakpe.service.EmployeeServiceTests;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * Tests associés à l'authentification d'un utilisateur depuis la base de données et si nécessaire le LDAP
 *
 * @author jntakpe
 */
@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles(ProfileConstants.PROD)
public class CompositeAuthenticationProviderIT {

    public static final String EXISTING_MAL = "jocelyn.ntakpe@soprasteria.com";

    @Autowired
    private CompositeAuthentificationProvider compositeAuthentificationProvider;

    @Test
    public void authenticate_shouldAuthenticateUserFromDB() {
        Authentication authentication = new UsernamePasswordAuthenticationToken(EmployeeServiceTests.EXISTING_LOGIN, "test");
        Authentication auth = compositeAuthentificationProvider.authenticate(authentication);
        assertThat(auth).isNotNull();
        assertThat(auth.getPrincipal()).isNotNull().isOfAnyClassIn(SpringSecurityUser.class);
        SpringSecurityUser principal = (SpringSecurityUser) auth.getPrincipal();
        assertThat(principal.getEmail()).isEqualToIgnoringCase(EXISTING_MAL);
    }

    @Test
    public void authenticate_shouldAuthenticateUserFromLdap() {
        Authentication authentication = new UsernamePasswordAuthenticationToken(EmployeeServiceTests.EXISTING_LOGIN, "Maistg31*");
        Authentication auth = compositeAuthentificationProvider.authenticate(authentication);
        assertThat(auth).isNotNull();
        assertThat(auth.getPrincipal()).isNotNull().isOfAnyClassIn(SpringSecurityUser.class);
        SpringSecurityUser principal = (SpringSecurityUser) auth.getPrincipal();
        assertThat(principal.getEmail()).isEqualToIgnoringCase("jocelyn.ntakpe@soprasteria.com");
    }

    @Test(expected = BadCredentialsException.class)
    public void authenticate_shouldNotAuthenticateUserCuzWrongPassword() {
        Authentication authentication = new UsernamePasswordAuthenticationToken(EmployeeServiceTests.EXISTING_LOGIN, "wrongpwd");
        compositeAuthentificationProvider.authenticate(authentication);
        fail("should have failed at this point");
    }

    @Test(expected = AccountExpiredException.class)
    public void authenticate_shouldNotAuthenticateUserCuzExpired() {
        Authentication authentication = new UsernamePasswordAuthenticationToken(DatabaseUserDetailsServiceTests.EXPIRED_USER, "test");
        compositeAuthentificationProvider.authenticate(authentication);
        fail("should have failed at this point");
    }
}
