package com.github.jntakpe.service;

import com.github.jntakpe.entity.Session;
import com.github.jntakpe.entity.Training;
import com.github.jntakpe.utils.TrainingTestsUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


/**
 * Tests associés à l'entité {@link com.github.jntakpe.entity.Training}
 *
 * @author jntakpe
 */
public class TrainingServiceTest extends AbstractTestsService {

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
        Training reactJS = trainingService.save(new Training("ReactJS", 3));
        assertThat(reactJS).isNotNull();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameIgnoreCase() {
        trainingService.save(new Training(EXISTING_NAME.toUpperCase(), 3));
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToCreateCuzSameNameMatchCase() {
        trainingService.save(new Training(EXISTING_NAME, 3));
    }

    @Test
    public void save_shouldUpdate() {
        Training training = trainingTestsUtils.findAnyTraining();
        String updatedTrainingName = "updatedTraining";
        training.setName(updatedTrainingName);
        trainingTestsUtils.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE name=LOWER('" + updatedTrainingName + "')";
        Training result = jdbcTemplate.queryForObject(query, (rs, rowNum) -> new Training(rs.getString("name"), 3));
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualToIgnoringCase(updatedTrainingName);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailToUpdateCuzSameNameMatchCase() {
        List<Training> trainings = trainingService.findAll();
        assertThat(trainings.size()).isGreaterThanOrEqualTo(2);
        Training training = new Training(trainings.get(1).getName(), trainings.get(1).getDuration());
        training.setId(trainings.get(0).getId());
        trainingService.save(training);
    }

    @Test
    public void delete_shouldRemoveOne() {
        Training training = trainingTestsUtils.findAnyTraining();
        trainingService.delete(training.getId());
        trainingTestsUtils.flush();
        String query = "SELECT id FROM " + TABLE_NAME + " WHERE name=LOWER('" + training.getName() + "')";
        assertThat(jdbcTemplate.queryForList(query, Long.class)).isEmpty();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries - 1);
        String linkedQuery = "SELECT id FROM " + SessionServiceTest.TABLE_NAME + " WHERE training_id = " + training.getId();
        assertThat(jdbcTemplate.queryForList(linkedQuery, Session.class)).isEmpty();
    }

    @Test(expected = EntityNotFoundException.class)
    public void delete_shouldFailCuzIdDoesntExist() {
        trainingService.delete(999L);
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }
}