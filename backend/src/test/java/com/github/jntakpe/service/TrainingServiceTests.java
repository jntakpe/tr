package com.github.jntakpe.service;

import com.github.jntakpe.model.Session;
import com.github.jntakpe.model.Training;
import com.github.jntakpe.utils.TrainingTestsUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;


/**
 * Tests associés à l'entité {@link Training}
 *
 * @author jntakpe
 */
@SpringBootTest
@RunWith(SpringRunner.class)
public class TrainingServiceTests extends AbstractDBServiceTests {

    public static final String EXISTING_NAME = "Hibernate";

    private static final String TABLE_NAME = "training";

    @Autowired
    private TrainingService trainingService;

    @Autowired
    private TrainingTestsUtils trainingTestsUtils;

    @Test
    public void findAll_shouldFind() {
        assertThat(trainingService.findAll()).isNotEmpty().hasSize(nbEntries);
    }

    @Test
    public void save_shouldCreate() {
        Training training = new Training();
        training.setName("ReactJS");
        training.setDuration(3);
        Training reactJS = trainingService.save(training);
        assertThat(reactJS).isNotNull();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameIgnoreCase() {
        Training training = new Training();
        training.setName(EXISTING_NAME.toUpperCase());
        training.setDuration(3);
        trainingService.save(training);
        fail("should have failed at this point");
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameMatchCase() {
        Training training = new Training();
        training.setName(EXISTING_NAME);
        training.setDuration(3);
        trainingService.save(training);
        fail("should have failed at this point");
    }

    @Test
    public void save_shouldUpdate() {
        Training training = trainingTestsUtils.findAnyTraining();
        String updatedTrainingName = "updatedTraining";
        trainingTestsUtils.detach(training);
        training.setName(updatedTrainingName);
        trainingService.save(training);
        trainingTestsUtils.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE name=LOWER('" + updatedTrainingName + "')";
        Training result = jdbcTemplate.queryForObject(query, (rs, rowNum) -> {
            Training mapper = new Training();
            mapper.setName(rs.getString("name"));
            mapper.setDuration(3);
            return mapper;
        });
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualToIgnoringCase(updatedTrainingName);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToUpdateCuzSameNameMatchCase() {
        List<Training> trainings = trainingService.findAll();
        assertThat(trainings.size()).isGreaterThanOrEqualTo(2);
        Training training = new Training();
        training.setId(trainings.get(0).getId());
        training.setName(trainings.get(1).getName());
        training.setDuration(trainings.get(1).getDuration());
        trainingService.save(training);
        fail("should have failed at this point");
    }

    @Test
    public void delete_shouldRemoveOne() {
        Training training = trainingTestsUtils.findUnusedTraining();
        trainingService.delete(training.getId());
        trainingTestsUtils.flush();
        String query = "SELECT id FROM " + TABLE_NAME + " WHERE name=LOWER('" + training.getName() + "')";
        assertThat(jdbcTemplate.queryForList(query, Long.class)).isEmpty();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries - 1);
        String linkedQuery = "SELECT id FROM " + SessionServiceTests.TABLE_NAME + " WHERE training_id = " + training.getId();
        assertThat(jdbcTemplate.queryForList(linkedQuery, Session.class)).isEmpty();
    }

    @Test(expected = EntityNotFoundException.class)
    public void delete_shouldFailCuzIdDoesntExist() {
        trainingService.delete(999L);
        fail("should have failed at this point");
    }

    @Test
    public void findConstraints_shouldBeEmpty() {
        assertThat(trainingService.findConstraints(trainingTestsUtils.findUnusedTraining().getId())).isEmpty();
    }

    @Test
    public void findConstaints_shouldNotBeEmpty() {
        assertThat(trainingService.findConstraints(trainingTestsUtils.findUsedTraining().getId())).isNotEmpty();
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }
}