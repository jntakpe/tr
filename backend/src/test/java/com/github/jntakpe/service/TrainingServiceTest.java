package com.github.jntakpe.service;

import com.github.jntakpe.entity.Training;
import com.github.jntakpe.repository.TrainingRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

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
    private TrainingRepository trainingRepository;

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

    @Test
    public void save_shouldUpdate() {
        Training training = trainingRepository.findAll().stream().findAny().orElseThrow(() -> new IllegalStateException("No training"));
        String updatedTrainingName = "updatedTraining";
        training.setName(updatedTrainingName);
        trainingRepository.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE name=LOWER('" + updatedTrainingName + "')";
        Training result = jdbcTemplate.queryForObject(query, (rs, rowNum) -> new Training(rs.getString("name"), 3));
        assertThat(result).isNotNull();
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void save_shouldFailToUpdateCuzSameNameMatchCase() {
        List<Training> trainings = trainingService.findAll();
        assertThat(trainings.size()).isGreaterThanOrEqualTo(2);
        trainings.get(0).setName(trainings.get(1).getName());
        trainingRepository.flush();
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void save_shouldFailToCreateCuzSameNameIgnoreCase() {
        trainingService.save(new Training(EXISTING_NAME.toUpperCase(), 3));
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void save_shouldFailToCreateCuzSameNameMatchCase() {
        trainingService.save(new Training(EXISTING_NAME, 3));
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }
}