package com.github.jntakpe.service;

import com.github.jntakpe.config.ProfileConstants;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.utils.EmployeeTestUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.ldap.authentication.LdapAuthenticator;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests associés à la récupération d'une {@link com.github.jntakpe.model.Person} depuis le ldap
 *
 * @author jntakpe
 */
@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles(ProfileConstants.PROD)
public class PersonServiceIT extends AbstractDBServiceTests {

    private static final String TABLE_NAME = "employee";

    @Autowired
    private PersonService personService;

    @Autowired
    private LdapAuthenticator ldapAuthenticator;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeeTestUtils employeeTestUtils;

    @Test
    public void save_shouldCreateNewUser() {
        String user = "cegiraud";
        String password = "Ouiche4*+";
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, password);
        DirContextOperations ctx = ldapAuthenticator.authenticate(auth);
        Employee employee = personService.save(ctx, password);
        assertThat(employee).isNotNull();
        assertThat(employee.getLastLdapCheck()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(passwordEncoder.matches(password, employee.getPassword())).isTrue();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test
    public void save_shouldUpdateUser() {
        String user = "jntakpe";
        String password = "Maistg31*";
        String joss = employeeTestUtils.findDefaultEmployee().getFirstName();
        assertThat(joss).isEqualTo("Joss");
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, password);
        DirContextOperations ctx = ldapAuthenticator.authenticate(auth);
        Employee employee = personService.save(ctx, password);
        assertThat(employee).isNotNull();
        assertThat(employee.getLastLdapCheck()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(passwordEncoder.matches(password, employee.getPassword())).isTrue();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries);
        assertThat(employee.getFirstName()).isNotEqualToIgnoringCase(joss);
        assertThat(employee.getFirstName()).isEqualToIgnoringCase("Jocelyn");
    }


    @Override
    public String getTableName() {
        return TABLE_NAME;
    }
}
