package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Domain;
import com.github.jntakpe.model.Training;
import com.github.jntakpe.service.EmployeeServiceTests;
import com.github.jntakpe.service.TrainingService;
import com.github.jntakpe.utils.TrainingTestsUtils;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests associés à la ressource REST {@link TrainingResource}
 *
 * @author jntakpe
 */
public class TrainingResourceTests extends AbstractResourceTests {

    @Autowired
    private TrainingTestsUtils trainingTestsUtils;

    @Mock
    private TrainingService mockTrainingService;

    @Override
    public Object getMockResource() {
        return new TrainingResource(mockTrainingService);
    }

    @Test
    public void findAll_shouldFind() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.TRAININGS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
        resultActions.andExpect(jsonPath("$.[*].name").isNotEmpty());
    }

    @Test
    public void findAll_shouldFindWithSessionCount() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.TRAININGS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
        resultActions.andExpect(jsonPath("$.[*].nbSessions").isNotEmpty());
    }

    @Test
    public void findAll_shouldNotFind() throws Exception {
        when(mockTrainingService.findAll()).thenReturn(Collections.emptyList());
        ResultActions resultActions = mockMvc.perform(get(UriConstants.TRAININGS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayEmpty(resultActions);
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void create_shouldCreate() throws Exception {
        String name = "some training";
        Training training = new Training();
        training.setName(name);
        training.setDomain(Domain.TECHNOLOGIES);
        training.setDuration(3);
        ResultActions resultActions = realMvc.perform(post(UriConstants.TRAININGS)
                .content(objectMapper.writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsCreatedAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.id").isNumber());
        resultActions.andExpect(jsonPath("$.name").value(name));
    }

    @Test
    public void create_shouldFailCuzMissingValue() throws Exception {
        Training training = new Training();
        training.setName("fail");
        training.setDomain(Domain.COMMERCE);
        training.setDuration(null);
        ResultActions resultActions = realMvc.perform(post(UriConstants.TRAININGS)
                .content(objectMapper.writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void create_shouldFailCuzNameAlreadyTaken() throws Exception {
        Training training = new Training();
        training.setName(trainingTestsUtils.findAnyTraining().getName());
        training.setDomain(Domain.COMMERCE);
        training.setDuration(1);
        ResultActions resultActions = realMvc.perform(post(UriConstants.TRAININGS)
                .content(objectMapper.writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
        resultActions.andDo(print());
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void update_shouldUpdate() throws Exception {
        Training training = trainingTestsUtils.findAnyTraining();
        String updatedName = "web updated training";
        training.setName(updatedName);
        ResultActions resultActions = realMvc.perform(put(UriConstants.TRAININGS + "/{id}", training.getId())
                .content(objectMapper.writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.name").value(updatedName));
    }

    @Test
    public void update_shouldFailCuzMissingValue() throws Exception {
        Training training = trainingTestsUtils.findAnyTraining();
        training.setDuration(null);
        ResultActions resultActions = realMvc.perform(put(UriConstants.TRAININGS + "/{id}", training.getId())
                .content(objectMapper.writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void delete_shouldDelete() throws Exception {
        Training training = trainingTestsUtils.findUnusedTraining();
        ResultActions resultActions = realMvc.perform(delete(UriConstants.TRAININGS + "/{id}", training.getId())
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNoContent());
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void delete_shouldFailCuzIdDoesntExist() throws Exception {
        ResultActions resultActions = realMvc.perform(delete(UriConstants.TRAININGS + "/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNotFound());
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void constraints_shouldBeEmpty() throws Exception {
        Training training = trainingTestsUtils.findUnusedTraining();
        ResultActions resultActions = realMvc.perform(get(UriConstants.TRAININGS + "/{id}/constraints", training.getId())
                .accept(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNoContent());
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void constraints_shouldNotBeEmpty() throws Exception {
        Training training = trainingTestsUtils.findUsedTraining();
        ResultActions resultActions = realMvc.perform(get(UriConstants.TRAININGS + "/{id}/constraints", training.getId())
                .accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
    }
}
