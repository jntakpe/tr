package com.github.jntakpe.service;

import org.assertj.db.type.Table;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

/**
 * Méthodes utilitaires de tests des services
 *
 * @author jntakpe
 */
@SpringBootTest
public abstract class AbstractServiceTests extends AbstractTransactionalJUnit4SpringContextTests {

    protected int nbEntries;

    protected Table table;

    protected JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void setUp() throws Exception {
        table = new Table(dataSource, getTableName());
        jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Before
    public void beforeEach() {
        nbEntries = countRowsInCurrentTable();
    }

    public abstract String getTableName();

    protected int countRowsInCurrentTable() {
        return countRowsInTable(getTableName());
    }
}
