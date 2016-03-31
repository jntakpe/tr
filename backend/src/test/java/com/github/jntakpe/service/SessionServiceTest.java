package com.github.jntakpe.service;

import com.github.jntakpe.entity.Collaborateur;
import com.github.jntakpe.entity.Location;
import com.github.jntakpe.entity.Session;
import com.github.jntakpe.entity.Training;
import com.github.jntakpe.repository.CollaborateurRepository;
import com.github.jntakpe.repository.LocationRepository;
import com.github.jntakpe.repository.SessionRepository;
import com.github.jntakpe.repository.TrainingRepository;
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

    public static final LocalDate SESSION_DATE = LocalDate.of(2016, 1, 1);

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private CollaborateurRepository collaborateurRepository;

    @Test
    public void save_shouldCreate() {
        Training training = trainingRepository.findByNameIgnoreCase(TrainingServiceTest.EXISTING_NAME)
                .orElseThrow(() -> new IllegalStateException("No training"));
        Location location = locationRepository.findByNameIgnoreCase(LocationServiceTests.EXISTING_NAME)
                .orElseThrow(() -> new IllegalStateException("No location"));
        Collaborateur collaborateur = collaborateurRepository.findByLoginIgnoreCase(CollaborateurServiceTests.EXISTING_LOGIN)
                .orElseThrow(() -> new IllegalStateException("No collab"));
        Session session = sessionService.save(new Session(SESSION_DATE, location, training, collaborateur));
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
