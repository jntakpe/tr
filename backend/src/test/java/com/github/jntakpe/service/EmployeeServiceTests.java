package com.github.jntakpe.service;

import com.github.jntakpe.model.Employee;
import com.github.jntakpe.utils.EmployeeTestUtils;
import org.hibernate.Hibernate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * Tests associés à l'entité {@link com.github.jntakpe.model.Employee}
 *
 * @author jntakpe
 */
@SpringBootTest
@RunWith(SpringRunner.class)
public class EmployeeServiceTests extends AbstractDBServiceTests {

    public static final String EXISTING_LOGIN = "jntakpe";

    public static final String UNUSED_LOGIN = "jguerrin";

    public static final String SOME_UNKNOWN_LOGIN = "Someunknownlogin";

    private static final String TABLE_NAME = "employee";

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeTestUtils employeeTestUtils;

    @Test
    public void findByLogin_shouldFindOne() {
        assertThat(employeeService.findByLogin(EXISTING_LOGIN)).isPresent();
    }

    @Test
    public void findByLogin_shouldFindIgnoringCase() {
        assertThat(employeeService.findByLogin(EXISTING_LOGIN.toUpperCase())).isPresent();
        assertThat(employeeService.findByLogin(EXISTING_LOGIN.toLowerCase())).isPresent();
    }

    @Test
    public void findByLogin_shouldNotFind() {
        assertThat(employeeService.findByLogin(SOME_UNKNOWN_LOGIN)).isNotPresent();
    }

    @Test
    public void findStartingByLogin_shouldFindOne() {
        assertThat(employeeService.findStartingByLogin("jnta")).isNotEmpty().hasSize(1);
    }

    @Test
    public void findStartingByLogin_shouldFindSome() {
        assertThat(employeeService.findStartingByLogin("j")).isNotEmpty().hasSize(2);
    }

    @Test
    public void findStartingByLogin_shouldFindSomeIgnoringCase() {
        assertThat(employeeService.findStartingByLogin("J")).isNotEmpty().hasSize(2);
    }

    @Test
    public void findStartingByLogin_shouldFindEmpty() {
        assertThat(employeeService.findStartingByLogin("W")).isEmpty();
    }

    @Test
    public void findAllTrainers_shouldFind() {
        assertThat(employeeService.findAllTrainers().size()).isNotZero().isEqualTo(employeeTestUtils.countTrainers().intValue());
    }

    @Test
    public void saveFromLdap_shouldUpdate() {
        Employee employee = employeeTestUtils.findDefaultEmployee();
        Employee saved = employeeService.saveFromLdap(employee);
        assertThat(saved).isEqualTo(employee);
        assertThat(saved.getLastLdapCheck()).isEqualToIgnoringSeconds(LocalDateTime.now());
    }

    @Test
    public void saveFromLdap_shouldCreate() {
        Employee employee = new Employee();
        employee.setLogin("toSave");
        employee.setEmail("tosave@mail.com");
        Employee saved = employeeService.saveFromLdap(employee);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getLastLdapCheck()).isEqualToIgnoringSeconds(LocalDateTime.now());
    }

    @Test
    public void findByIdWithAuthorities_shouldFind() {
        Long id = employeeTestUtils.findDefaultEmployee().getId();
        Employee employee = employeeService.findByIdWithAuthorities(id);
        assertThat(employee).isNotNull();
        assertThat(employee.getId()).isEqualTo(id);
        assertThat(Hibernate.isInitialized(employee.getAuthorities())).isTrue();
    }

    @Test(expected = EntityNotFoundException.class)
    public void findByIdWithAuthorities_shouldNotFind() {
        employeeService.findByIdWithAuthorities(999L);
        fail("should have failed at this point");
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

}
