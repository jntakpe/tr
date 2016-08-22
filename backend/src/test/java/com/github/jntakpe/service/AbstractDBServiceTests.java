package com.github.jntakpe.service;

import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.jdbc.JdbcTestUtils;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

/**
 * Méthodes utilitaires de tests des services
 *
 * @author jntakpe
 */
public abstract class AbstractDBServiceTests {

    protected int nbEntries;

    protected JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void setUp() throws Exception {
        jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Before
    public void beforeEach() {
        nbEntries = countRowsInCurrentTable();
    }

    public abstract String getTableName();

    protected int countRowsInCurrentTable() {
        return JdbcTestUtils.countRowsInTable(jdbcTemplate, getTableName());
    }
}
