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
        Hibernate.initialize(session.getLocation());
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
        Employee trainer = employeeTestUtils.findDefaultEmployee();
        return getSession(startDate, location, training, trainer);
    }

    @Transactional(readOnly = true)
    public Long countLocationsById(Long id) {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM session WHERE location_id=" + id, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countTrainingsById(Long id) {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM session WHERE training_id=" + id, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByLocationName(String name) {
        String query = "SELECT count(*) FROM session INNER JOIN location ON session.location_id = location.id WHERE location.name LIKE '"
                + name + "%'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByLocationCity(String city) {
        String query = "SELECT count(*) FROM session INNER JOIN location ON session.location_id = location.id WHERE location.city LIKE '"
                + city + "%'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByLocationNameAndCity(String name, String city) {
        String query = "SELECT count(*) FROM session INNER JOIN location ON session.location_id = location.id " +
                "WHERE location.name LIKE '" + name + "%' AND location.city LIKE '" + city + "%'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByTrainingName(String name) {
        String query = "SELECT count(*) FROM session INNER JOIN training ON session.training_id = training.id WHERE training.name LIKE '"
                + name + "%'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByTrainingDomain(String domain) {
        String query = "SELECT count(*) FROM session INNER JOIN training ON session.training_id = training.id WHERE training.domain = '"
                + domain + "'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByTrainingNameAndDomain(String name, String domain) {
        String query = "SELECT count(*) FROM session INNER JOIN training ON session.training_id = training.id " +
                "WHERE training.name LIKE '" + name + "%' AND training.domain = '" + domain + "'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByLocationAndTraining(Location location, Training training) {
        String query = "SELECT count(*) FROM session INNER JOIN location ON session.location_id = location.id " +
                "INNER JOIN training ON session.training_id = training.id " +
                "WHERE location.name LIKE '" + location.getName() + "%' AND location.city LIKE '" + location.getCity() + "%' " +
                "AND training.name LIKE '" + training.getName() + "%' AND training.domain = '" + training.getDomain().name() + "'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByLocationAndTrainingAndTrainer(Location location, Training training, Employee trainer) {
        String query = "SELECT count(*) FROM session INNER JOIN location ON session.location_id = location.id " +
                "INNER JOIN training ON session.training_id = training.id " +
                "INNER JOIN employee ON session.trainer_id = employee.id " +
                "WHERE location.name LIKE '" + location.getName() + "%' AND location.city LIKE '" + location.getCity() + "%' " +
                "AND training.name LIKE '" + training.getName() + "%' AND training.domain = '" + training.getDomain().name() + "' " +
                "AND first_name LIKE '" + trainer.getFirstName() + "%' AND last_name LIKE '" + trainer.getLastName() + "%'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByTrainerFirstName(String firstName) {
        String query = "SELECT count(*) FROM session INNER JOIN employee ON session.trainer_id = employee.id " +
                "WHERE first_name LIKE '" + firstName + "%'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByTrainerLastName(String lastName) {
        String query = "SELECT count(*) FROM session INNER JOIN employee ON session.trainer_id = employee.id " +
                "WHERE last_name LIKE '" + lastName + "%'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByTrainerFirstAndLastNames(String firstName, String lastName) {
        String query = "SELECT count(*) FROM session INNER JOIN employee ON session.trainer_id = employee.id " +
                "WHERE first_name LIKE '" + firstName + "%' AND last_name LIKE '" + lastName + "%'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByStartDate(LocalDate startDate) {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM session WHERE start = '" + startDate.toString() + "'", Long.class);
    }

    @Transactional(readOnly = true)
    public Long countByLocationAndTrainingAndTrainerAndStart(Location location, Training training, Employee trainer, LocalDate start) {
        String query = "SELECT count(*) FROM session INNER JOIN location ON session.location_id = location.id " +
                "INNER JOIN training ON session.training_id = training.id " +
                "INNER JOIN employee ON session.trainer_id = employee.id " +
                "WHERE location.name LIKE '" + location.getName() + "%' AND location.city LIKE '" + location.getCity() + "%' " +
                "AND training.name LIKE '" + training.getName() + "%' AND training.domain = '" + training.getDomain().name() + "' " +
                "AND employee.first_name LIKE '" + trainer.getFirstName() + "%' " +
                "AND employee.last_name LIKE '" + trainer.getLastName() + "%' " +
                "AND session.start = '" + start + "'";
        return jdbcTemplate.queryForObject(query, Long.class);
    }

    @Transactional(readOnly = true)
    public Long count() {
        return jdbcTemplate.queryForObject("SELECT count(*) FROM session", Long.class);
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
