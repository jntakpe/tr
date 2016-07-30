package com.github.jntakpe.service;

import com.github.jntakpe.entity.Session;
import com.github.jntakpe.entity.Training;
import com.github.jntakpe.utils.SessionTestsUtils;
import com.github.jntakpe.utils.TrainingTestsUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityNotFoundException;
import java.sql.Date;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests associés à l'entité {@link Session}
 *
 * @author jntakpe
 */
public class SessionServiceTests extends AbstractServiceTests {

    public static final String TABLE_NAME = "session";

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionTestsUtils sessionTestsUtils;

    @Autowired
    private TrainingTestsUtils trainingTestsUtils;

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
        Session session = sessionTestsUtils.findAnySession();
        LocalDate updatedStart = LocalDate.of(2016, 2, 2);
        session.setStart(updatedStart);
        sessionTestsUtils.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE start='" + updatedStart.toString() + "'";
        Date startDate = jdbcTemplate.queryForObject(query, (rs, rowNum) -> rs.getDate("start"));
        assertThat(startDate).isNotNull();
        assertThat(startDate.toLocalDate()).isEqualTo(updatedStart);
    }

    @Test
    public void save_shouldUpdateTraining() {
        Session session = sessionTestsUtils.findAnySession();
        Training updatedTraining = trainingTestsUtils.findAnyTrainingButThis(session.getTraining());
        session.setStart(LocalDate.of(2012, 1, 2));
        session.setTraining(updatedTraining);
        sessionTestsUtils.flush();
        String query = "SELECT training_id FROM " + TABLE_NAME + " WHERE id='" + session.getId() + "'";
        Long trainingId = jdbcTemplate.queryForObject(query, Long.class);
        assertThat(trainingId).isNotNull();
        assertThat(trainingId).isEqualTo(updatedTraining.getId());

    }

    @Test
    public void delete_shouldRemoveOne() {
        Session session = sessionTestsUtils.findUnusedSession();
        sessionService.delete(session.getId());
        sessionTestsUtils.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE id='" + session.getId() + "'";
        assertThat(jdbcTemplate.queryForList(query, Long.class)).isEmpty();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries - 1);
    }

    @Test(expected = EntityNotFoundException.class)
    public void delete_shouldFailCuzIdDoesntExist() {
        sessionService.delete(999L);
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }
}
