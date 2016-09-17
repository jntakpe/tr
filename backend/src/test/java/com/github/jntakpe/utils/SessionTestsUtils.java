package com.github.jntakpe.utils;

import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Location;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.model.Training;
import com.github.jntakpe.repository.SessionRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Session}
 *
 * @author jntakpe
 */
@Component
public class SessionTestsUtils {

    private final LocationTestsUtils locationTestsUtils;

    private final TrainingTestsUtils trainingTestsUtils;

    private final EmployeeTestUtils employeeTestUtils;

    private final SessionRepository sessionRepository;

    private final JdbcTemplate jdbcTemplate;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public SessionTestsUtils(LocationTestsUtils locationTestsUtils,
                             TrainingTestsUtils trainingTestsUtils,
                             EmployeeTestUtils employeeTestUtils,
                             SessionRepository sessionRepository,
                             JdbcTemplate jdbcTemplate) {
        this.locationTestsUtils = locationTestsUtils;
        this.trainingTestsUtils = trainingTestsUtils;
        this.employeeTestUtils = employeeTestUtils;
        this.sessionRepository = sessionRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public Session findAnySession() {
        return sessionRepository.findAll().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No session"));
    }

    @Transactional(readOnly = true)
    public Session findAnySessionInitialized() {
        Session session = sessionRepository.findAll().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No session"));
        Hibernate.initialize(session.getTraining());
        Hibernate.initialize(session.getTrainer());
        return session;
    }

    @Transactional(readOnly = true)
    public Session findUnusedSession() {
        return sessionRepository.findAll().stream()
                .filter(s -> s.getRatings().isEmpty())
                .findAny()
                .orElseThrow(() -> new IllegalStateException("no unused session"));
    }

    @Transactional(readOnly = true)
    public Session getSessionWithDetachedRelations(LocalDate startDate) {
        Training training = trainingTestsUtils.findDefaultTraining();
        Location location = locationTestsUtils.findDefaultLocation();
        Employee employee = employeeTestUtils.findDefaultEmployee();
        Training detachedTraining = new Training();
        detachedTraining.setId(training.getId());
        detachedTraining.setName(training.getName());
        detachedTraining.setDuration(training.getDuration());
        Location detachedLocation = new Location();
        detachedLocation.setId(location.getId());
        detachedLocation.setName(location.getName());
        Employee detachedEmployee = new Employee();
        detachedEmployee.setId(employee.getId());
        detachedEmployee.setLogin(employee.getLogin());
        detachedEmployee.setEmail(employee.getEmail());
        return getSession(startDate, location, training, employee);
    }

    @Transactional(readOnly = true)
    public Session getSessionWithAttachedRelations(LocalDate startDate) {
        Training training = trainingTestsUtils.findDefaultTraining();
        Location location = locationTestsUtils.findDefaultLocation();
        Employee employee = employeeTestUtils.findDefaultEmployee();
        return getSession(startDate, location, training, employee);
    }

    @Transactional(readOnly = true)
    public Long countLocationsById(Long id) {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM session WHERE location_id=" + id, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countTrainingsById(Long id) {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM session WHERE training_id=" + id, Long.class);
    }

    public void flush() {
        sessionRepository.flush();
    }

    public void detach(Session session) {
        entityManager.detach(session);
    }

    private Session getSession(LocalDate startDate, Location location, Training training, Employee employee) {
        Session session = new Session();
        session.setStart(startDate);
        session.setLocation(location);
        session.setTraining(training);
        session.setTrainer(employee);
        return session;
    }

}
