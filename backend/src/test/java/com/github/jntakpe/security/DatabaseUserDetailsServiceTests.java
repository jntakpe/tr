package com.github.jntakpe.security;

import com.github.jntakpe.config.security.DatabaseUserDetailsService;
import com.github.jntakpe.service.EmployeeServiceTests;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * Tests associés à la récupération d'un utilisateur depuis la base de données
 *
 * @author jntakpe
 */
@SpringBootTest
@RunWith(SpringRunner.class)
public class DatabaseUserDetailsServiceTests {

    public static final String EXPIRED_USER = "sbourret";

    public static final String DEFAULT_PASSWORD = "test";

    @Autowired
    private DatabaseUserDetailsService databaseUserDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void loadUserByUsername_shouldLoadUser() {
        UserDetails user = databaseUserDetailsService.loadUserByUsername(EmployeeServiceTests.EXISTING_LOGIN);
        assertThat(user).isNotNull();
        assertThat(user.getUsername()).isNotNull().isEqualToIgnoringCase(EmployeeServiceTests.EXISTING_LOGIN);
    }

    @Test(expected = BadCredentialsException.class)
    public void loadUserByUsername_shouldFailCuzNotFound() {
        assertThat(databaseUserDetailsService.loadUserByUsername(EmployeeServiceTests.SOME_UNKNOWN_LOGIN));
        fail("should have failed at this point");
    }

    @Test(expected = AccountExpiredException.class)
    public void loadUserByUsername_shouldFailCuzExpired() {
        assertThat(databaseUserDetailsService.loadUserByUsername(EXPIRED_USER));
        fail("should have failed at this point");
    }

    @Test
    public void checkPassword_shouldMatch() {
        UserDetails user = databaseUserDetailsService.loadUserByUsername(EmployeeServiceTests.EXISTING_LOGIN);
        databaseUserDetailsService.checkPassword(user, DEFAULT_PASSWORD, passwordEncoder);
    }

    @Test(expected = BadCredentialsException.class)
    public void checkPassword_shouldFailCuzBadCredentials() {
        UserDetails user = databaseUserDetailsService.loadUserByUsername(EmployeeServiceTests.EXISTING_LOGIN);
        databaseUserDetailsService.checkPassword(user, "wrongpass", passwordEncoder);
    }

}
