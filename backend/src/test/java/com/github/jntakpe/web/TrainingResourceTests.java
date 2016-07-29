package com.github.jntakpe.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Training;
import com.github.jntakpe.service.TrainingService;
import com.github.jntakpe.utils.TrainingTestsUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Collections;

import static com.github.jntakpe.web.WebTestsUtils.*;
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
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public class TrainingResourceTests {

    @Autowired
    private TrainingService trainingService;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TrainingTestsUtils trainingTestsUtils;

    @Mock
    private TrainingService mockTrainingService;

    private MockMvc realMvc;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.realMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
        this.mockMvc = MockMvcBuilders.standaloneSetup(new TrainingResource(mockTrainingService)).build();
    }

    @Test
    public void findAll_shouldFind() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.TRAININGS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
        resultActions.andExpect(jsonPath("$.[*].name").isNotEmpty());
    }

    @Test
    public void findAll_shouldNotFind() throws Exception {
        when(mockTrainingService.findAll()).thenReturn(Collections.emptyList());
        ResultActions resultActions = mockMvc.perform(get(UriConstants.TRAININGS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayEmpty(resultActions);
    }

    @Test
    public void create_shouldCreate() throws Exception {
        String locationName = "some location";
        Training training = new Training(locationName, 3);
        ResultActions resultActions = realMvc.perform(post(UriConstants.TRAININGS)
                .content(objectMapper.writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsCreatedAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.id").isNumber());
        resultActions.andExpect(jsonPath("$.name").value(locationName));
    }

    @Test
    public void create_shouldFailCuzMissingValue() throws Exception {
        Training training = new Training("fail", null);
        ResultActions resultActions = realMvc.perform(post(UriConstants.TRAININGS)
                .content(objectMapper.writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void create_shouldFailCuzNameAlreadyTaken() throws Exception {
        Training training = new Training(trainingTestsUtils.findAnyTraining().getName(), 1);
        ResultActions resultActions = realMvc.perform(post(UriConstants.TRAININGS)
                .content(objectMapper.writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
        resultActions.andDo(print());
    }

    @Test
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
    public void delete_shouldDelete() throws Exception {
        Training training = trainingTestsUtils.findAnyTraining();
        ResultActions resultActions = realMvc.perform(delete(UriConstants.TRAININGS + "/{id}", training.getId())
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNoContent());
    }

    @Test
    public void delete_shouldFailCuzIdDoesntExist() throws Exception {
        ResultActions resultActions = realMvc.perform(delete(UriConstants.TRAININGS + "/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNotFound());
    }

}
