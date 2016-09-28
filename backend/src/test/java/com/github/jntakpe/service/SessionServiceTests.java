package com.github.jntakpe.service;

import com.github.jntakpe.model.*;
import com.github.jntakpe.utils.LocationTestsUtils;
import com.github.jntakpe.utils.SessionTestsUtils;
import com.github.jntakpe.utils.TrainingTestsUtils;
import org.hibernate.Hibernate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityNotFoundException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * Tests associés à l'entité {@link Session}
 *
 * @author jntakpe
 */
@SpringBootTest
@RunWith(SpringRunner.class)
public class SessionServiceTests extends AbstractDBServiceTests {

    public static final String TABLE_NAME = "session";

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionTestsUtils sessionTestsUtils;

    @Autowired
    private TrainingTestsUtils trainingTestsUtils;

    @Autowired
    private LocationTestsUtils locationTestsUtils;

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
        Session session = sessionTestsUtils.findAnySessionInitialized();
        LocalDate updatedStart = LocalDate.of(2017, 11, 11);
        session.setStart(updatedStart);
        sessionTestsUtils.detach(session);
        sessionService.save(session);
        sessionTestsUtils.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE start='" + updatedStart.toString() + "'";
        Date startDate = jdbcTemplate.queryForObject(query, (rs, rowNum) -> rs.getDate("start"));
        assertThat(startDate).isNotNull();
        assertThat(startDate.toLocalDate()).isEqualTo(updatedStart);
    }

    @Test
    public void save_shouldUpdateTraining() {
        Session session = sessionTestsUtils.findAnySessionInitialized();
        Training updatedTraining = trainingTestsUtils.findAnyTrainingButThis(session);
        sessionTestsUtils.detach(session);
        session.setStart(LocalDate.of(2012, 1, 2));
        session.setTraining(updatedTraining);
        sessionService.save(session);
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

    @Test
    public void findById_shouldFindOne() {
        Session session = sessionService.findById(sessionTestsUtils.findAnySession().getId());
        assertThat(session).isNotNull();
    }

    @Test(expected = EntityNotFoundException.class)
    public void findById_shouldNotFind() {
        sessionService.findById(999L);
        fail("should have failed at this point");
    }

    @Test
    public void countByLocationId_shouldCountOneOrMore() {
        assertThat(sessionService.countByLocationId(locationTestsUtils.findUsedLocation().getId())).isGreaterThanOrEqualTo(1L);
    }

    @Test
    public void countByLocationId_shouldCountZero() {
        assertThat(sessionService.countByLocationId(locationTestsUtils.findUnusedLocation().getId())).isZero();
    }

    @Test
    public void countByTrainingId_shouldCountOneOrMore() {
        assertThat(sessionService.countByTrainingId(trainingTestsUtils.findUsedTraining().getId())).isGreaterThanOrEqualTo(1L);
    }

    @Test
    public void countByTrainingId_shouldCountZero() {
        assertThat(sessionService.countByTrainingId(trainingTestsUtils.findUnusedTraining().getId())).isZero();
    }

    @Test
    public void findByLocationId_shouldFindOneOrMore() {
        assertThat(sessionService.findByLocationId(locationTestsUtils.findUsedLocation().getId()).size()).isGreaterThanOrEqualTo(1);
    }

    @Test
    public void findByLocationId_shouldFetch() {
        List<Session> sessions = sessionService.findByLocationId(locationTestsUtils.findUsedLocation().getId());
        assertThat(sessions.get(0).getLocation()).isNotNull();
        assertThat(sessions.get(0).getTrainer()).isNotNull();
        assertThat(sessions.get(0).getTraining()).isNotNull();
        assertThat(Hibernate.isInitialized(sessions.get(0).getLocation())).isTrue();
        assertThat(Hibernate.isInitialized(sessions.get(0).getTrainer())).isTrue();
        assertThat(Hibernate.isInitialized(sessions.get(0).getTraining())).isTrue();
    }

    @Test
    public void findByLocationId_shouldFindZero() {
        assertThat(sessionService.findByLocationId(locationTestsUtils.findUnusedLocation().getId())).isEmpty();
    }

    @Test
    public void findByTrainingId_shouldFindOneOrMore() {
        assertThat(sessionService.findByTrainingId(trainingTestsUtils.findUsedTraining().getId()).size()).isGreaterThanOrEqualTo(1);
    }

    @Test
    public void findByTrainingId_shouldFetch() {
        List<Session> sessions = sessionService.findByTrainingId(trainingTestsUtils.findUsedTraining().getId());
        assertThat(sessions.get(0).getLocation()).isNotNull();
        assertThat(sessions.get(0).getTrainer()).isNotNull();
        assertThat(sessions.get(0).getTraining()).isNotNull();
        assertThat(Hibernate.isInitialized(sessions.get(0).getLocation())).isTrue();
        assertThat(Hibernate.isInitialized(sessions.get(0).getTrainer())).isTrue();
        assertThat(Hibernate.isInitialized(sessions.get(0).getTraining())).isTrue();
    }

    @Test
    public void findByTrainingId_shouldFindZero() {
        assertThat(sessionService.findByTrainingId(trainingTestsUtils.findUnusedTraining().getId())).isEmpty();
    }

    @Test
    public void findWithPredicate_shouldFindAllCuzNoSession() {
        assertThat(sessionService.findWithPredicate(null, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements()).isEqualTo(nbEntries);
    }

    @Test
    public void findWithPredicate_shouldFindNoneCuzUnknownLocationName() {
        Location location = new Location();
        location.setName("Unknown");
        Session session = new Session();
        session.setLocation(location);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements()).isZero();
    }

    @Test
    public void findWithPredicate_shouldFindNoneCuzUnknownLocationCity() {
        Location location = new Location();
        location.setCity("Unknown");
        Session session = new Session();
        session.setLocation(location);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements()).isZero();
    }

    @Test
    public void findWithPredicate_shouldFindOneWithFullLocation() {
        Session session = new Session();
        Location anyLocation = sessionTestsUtils.findAnySessionInitialized().getLocation();
        session.setLocation(anyLocation);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByLocationNameAndCity(anyLocation.getName(), anyLocation.getCity()));
    }

    @Test
    public void findWithPredicate_shouldFindSomeWithLocationCity() {
        Location location = new Location();
        location.setCity(sessionTestsUtils.findAnySessionInitialized().getLocation().getCity());
        Session session = new Session();
        session.setLocation(location);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByLocationCity(location.getCity()));
    }

    @Test
    public void findWithPredicate_shouldFindSomeWithLocationName() {
        Location location = new Location();
        location.setName(sessionTestsUtils.findAnySessionInitialized().getLocation().getName());
        Session session = new Session();
        session.setLocation(location);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByLocationName(location.getName()));
    }

    @Test
    public void findWithPredicate_shouldFindNoneCuzUnknownTrainingName() {
        Training training = new Training();
        training.setName("Unknown");
        Session session = new Session();
        session.setTraining(training);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements()).isZero();
    }

    @Test
    public void findWithPredicate_shouldFindOneWithFullTraining() {
        Session session = new Session();
        Training anyTraining = sessionTestsUtils.findAnySessionInitialized().getTraining();
        session.setTraining(anyTraining);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByTrainingNameAndDomain(anyTraining.getName(), anyTraining.getDomain().name()));
    }

    @Test
    public void findWithPredicate_shouldFindSomeWithTrainingDomain() {
        Training training = new Training();
        training.setDomain(Domain.TECHNOLOGIES);
        Session session = new Session();
        session.setTraining(training);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByTrainingDomain(training.getDomain().name()));
    }

    @Test
    public void findWithPredicate_shouldFindSomeWithTrainingName() {
        Training training = new Training();
        training.setName(sessionTestsUtils.findAnySessionInitialized().getTraining().getName());
        Session session = new Session();
        session.setTraining(training);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByTrainingName(training.getName()));
    }

    @Test
    public void findWithPredicate_shouldFindNoneCuzUnknownTrainerFirstName() {
        Employee trainer = new Employee();
        trainer.setFirstName("Unknown");
        Session session = new Session();
        session.setTrainer(trainer);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements()).isZero();
    }

    @Test
    public void findWithPredicate_shouldFindNoneCuzUnknownTrainerLastName() {
        Employee trainer = new Employee();
        trainer.setLastName("Unknown");
        Session session = new Session();
        session.setTrainer(trainer);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements()).isZero();
    }

    @Test
    public void findWithPredicate_shouldFindOneWithFullTrainer() {
        Session session = new Session();
        Employee anyTrainer = sessionTestsUtils.findAnySessionInitialized().getTrainer();
        session.setTrainer(anyTrainer);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByTrainerFirstAndLastNames(anyTrainer.getFirstName(), anyTrainer.getLastName()));
    }

    @Test
    public void findWithPredicate_shouldFindSomeWithTrainerFirstName() {
        Employee trainer = new Employee();
        trainer.setFirstName(sessionTestsUtils.findAnySessionInitialized().getTrainer().getFirstName());
        Session session = new Session();
        session.setTrainer(trainer);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByTrainerFirstName(trainer.getFirstName()));
    }

    @Test
    public void findWithPredicate_shouldFindSomeWithTrainerLastName() {
        Employee trainer = new Employee();
        trainer.setLastName(sessionTestsUtils.findAnySessionInitialized().getTrainer().getLastName());
        Session session = new Session();
        session.setTrainer(trainer);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByTrainerLastName(trainer.getLastName()));
    }

    @Test
    public void findWithPredicate_shouldFindOneWithTrainingAndLocation() {
        Session session = sessionTestsUtils.findAnySessionInitialized();
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils.countByLocationAndTraining(session.getLocation(), session.getTraining()));
    }

    @Test
    public void findWithPredicate_shouldFindOneWithTrainingAndLocationAndTrainer() {
        Session session = sessionTestsUtils.findAnySessionInitialized();
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements())
                .isNotZero()
                .isEqualTo(sessionTestsUtils
                        .countByLocationAndTrainingAndTrainer(session.getLocation(), session.getTraining(), session.getTrainer()));
    }

    @Test
    public void findWithPredicate_shouldFindNoneWithTrainingAndLocationUnknown() {
        Session session = new Session();
        session.setTraining(trainingTestsUtils.findAnyTraining());
        Location location = new Location();
        location.setName("Unknown");
        session.setLocation(location);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements()).isZero();
    }

    @Test
    public void findWithPredicate_shouldFindNoneWithTrainingAndTrainerUnknown() {
        Session session = new Session();
        session.setTraining(trainingTestsUtils.findAnyTraining());
        Employee trainer = new Employee();
        trainer.setFirstName("Unknown");
        session.setTrainer(trainer);
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements()).isZero();
    }

    @Test
    public void findWithPredicate_shouldFindOneWithTrainingUnknownAndLocation() {
        Session session = new Session();
        Training training = new Training();
        training.setName("Unknown");
        session.setTraining(training);
        session.setLocation(locationTestsUtils.findAnyLocation());
        assertThat(sessionService.findWithPredicate(session, new PageRequest(0, Integer.MAX_VALUE)).getTotalElements()).isZero();
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

}
