package com.github.jntakpe.security;

import com.github.jntakpe.config.security.AuthoritiesConstants;
import com.github.jntakpe.config.security.SecurityUtils;
import com.github.jntakpe.config.security.SpringSecurityUser;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.service.EmployeeServiceTests;
import com.github.jntakpe.utils.EmployeeTestUtils;
import org.hibernate.LazyInitializationException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;


/**
 * Tests associés à la classe utilitaire de sécurité {@link SecurityUtils}
 *
 * @author jntakpe
 */
@SpringBootTest
@RunWith(SpringRunner.class)
public class SecurityUtilsTests {

    @Autowired
    private EmployeeTestUtils employeeTestUtils;

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void getCurrentUser_shouldBePresent() {
        Optional<SpringSecurityUser> opt = SecurityUtils.getCurrentUser();
        assertThat(opt).isPresent();
        SpringSecurityUser user = opt.get();
        assertThat(user.getUsername()).isEqualToIgnoringCase(EmployeeServiceTests.EXISTING_LOGIN);
        assertThat(user.getAuthorities()).isNotEmpty().contains(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN));
    }

    @Test
    public void getCurrentUser_shouldNotBePresent() {
        assertThat(SecurityUtils.getCurrentUser()).isNotPresent();
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void getCurrentUserOrThrow_shouldReturnUser() {
        SpringSecurityUser user = SecurityUtils.getCurrentUserOrThrow();
        assertThat(user.getUsername()).isEqualToIgnoringCase(EmployeeServiceTests.EXISTING_LOGIN);
        assertThat(user.getAuthorities()).isNotEmpty().contains(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN));
    }

    @Test(expected = UsernameNotFoundException.class)
    public void getCurrentUserOrThrow_shouldFailCuzNoUserConnected() {
        SecurityUtils.getCurrentUserOrThrow();
        fail("should have failed at this point");
    }

    @Test
    public void authoritiesToSimpleGrant_shouldConvertToSimpleGrant() {
        Employee employee = employeeTestUtils.findDefaultEmployeeWithAuthories();
        List<SimpleGrantedAuthority> authorities = SecurityUtils.authoritiesToSimpleGrant(employee.getAuthorities());
        assertThat(authorities).hasSameSizeAs(employee.getAuthorities());
        assertThat(authorities).contains(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN));
    }

    @Test(expected = LazyInitializationException.class)
    public void authoritiesToSimpleGrant_shouldFailCuzAuthoritiesNotInitialized() {
        Employee employee = employeeTestUtils.findDefaultEmployee();
        SecurityUtils.authoritiesToSimpleGrant(employee.getAuthorities());
        fail("should have failed at this point");
    }
}
