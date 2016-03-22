package com.github.jntakpe.service;

import com.github.jntakpe.TrainingRatingApplication;
import org.assertj.db.type.Table;
import org.junit.Before;
import org.junit.BeforeClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.web.WebAppConfiguration;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

/**
 * Méthodes utilitaires de tests des services
 *
 * @author jntakpe
 */
@WebAppConfiguration
@SpringApplicationConfiguration(TrainingRatingApplication.class)
public abstract class AbstractTestsService extends AbstractTransactionalJUnit4SpringContextTests {

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

    protected int countRowsInCurrentTable() {
        return countRowsInTable(getTableName());
    }

    public abstract String getTableName();
}
