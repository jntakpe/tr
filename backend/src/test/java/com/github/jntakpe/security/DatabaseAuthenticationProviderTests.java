package com.github.jntakpe.security;

import com.github.jntakpe.config.security.DatabaseAuthentificationProvider;
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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * Tests associés à l'authentification d'un utlisateur depuis la base ded données
 *
 * @author jntakpe
 */
@SpringBootTest
@RunWith(SpringRunner.class)
public class DatabaseAuthenticationProviderTests {

    @Autowired
    private DatabaseAuthentificationProvider databaseAuthentificationProvider;

    @Test
    public void authenticate_shouldAuthenticateUser() {
        Authentication authentication = new UsernamePasswordAuthenticationToken(EmployeeServiceTests.EXISTING_LOGIN, "test");
        Authentication auth = databaseAuthentificationProvider.authenticate(authentication);
        assertThat(auth).isNotNull();
        assertThat(auth.getPrincipal()).isNotNull().isOfAnyClassIn(SpringSecurityUser.class);
        SpringSecurityUser principal = (SpringSecurityUser) auth.getPrincipal();
        assertThat(principal.getEmail()).isEqualToIgnoringCase("jocelyn.ntakpe@soprasteria.com");
    }

    @Test(expected = UsernameNotFoundException.class)
    public void authenticate_shouldNotAuthenticateUserCuzUnknownUser() {
        Authentication authentication = new UsernamePasswordAuthenticationToken("unknownUser", "test");
        databaseAuthentificationProvider.authenticate(authentication);
        fail("should have failed at this point");
    }

    @Test(expected = BadCredentialsException.class)
    public void authenticate_shouldNotAuthenticateUserCuzWrongPassword() {
        Authentication authentication = new UsernamePasswordAuthenticationToken(EmployeeServiceTests.EXISTING_LOGIN, "wrongpwd");
        databaseAuthentificationProvider.authenticate(authentication);
        fail("should have failed at this point");
    }

    @Test(expected = AccountExpiredException.class)
    public void authenticate_shouldNotAuthenticateUserCuzExpired() {
        Authentication authentication = new UsernamePasswordAuthenticationToken(DatabaseUserDetailsServiceTests.EXPIRED_USER, "test");
        databaseAuthentificationProvider.authenticate(authentication);
        fail("should have failed at this point");
    }
}
