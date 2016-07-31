package com.github.jntakpe.service;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests associés à l'entité {@link com.github.jntakpe.entity.Employee}
 *
 * @author jntakpe
 */
public class EmployeeServiceTests extends AbstractDBServiceTests {

    public static final String EXISTING_LOGIN = "jntakpe";

    public static final String SOME_UNKNOWN_LOGIN = "Someunknownlogin";

    private static final String TABLE_NAME = "employee";

    @Autowired
    private EmployeeService employeeService;

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

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

}
