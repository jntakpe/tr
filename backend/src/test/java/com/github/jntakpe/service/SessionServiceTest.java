package com.github.jntakpe.service;

import com.github.jntakpe.entity.Session;
import com.github.jntakpe.repository.SessionRepository;
import com.github.jntakpe.utils.SessionTestsUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Date;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests associés à la classe {@link SessionService}
 *
 * @author jntakpe
 */
public class SessionServiceTest extends AbstractTestsService {

    public static final String TABLE_NAME = "session";

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionTestsUtils sessionTestsUtils;

    @Autowired
    private SessionRepository sessionRepository;

    @Test
    public void findAll_shouldFind() {
        assertThat(sessionService.findAll()).isNotEmpty().hasSize(nbEntries);
    }

    @Test
    public void save_shouldCreate() {
        Session attachedSession = sessionTestsUtils.getSessionWithAttachedRelations(LocalDate.of(2016, 1, 1));
        Session session = sessionService.save(attachedSession);
        assertThat(session).isNotNull();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test
    public void save_shouldCreateWithDetachedRelations() {
        Session detachedSessionRelations = sessionTestsUtils.getSessionWithDetachedRelations(LocalDate.of(2015, 1, 1));
        Session session = sessionService.save(detachedSessionRelations);
        assertThat(session).isNotNull();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test
    public void save_shouldUpdate() {
        Session session = sessionRepository.findAll().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No session"));
        LocalDate updatedStart = LocalDate.of(2016, 2, 2);
        session.setStart(updatedStart);
        sessionRepository.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE start='" + updatedStart.toString() + "'";
        Date startDate = jdbcTemplate.queryForObject(query, (rs, rowNum) -> rs.getDate("start"));
        assertThat(startDate).isNotNull();
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }
}
