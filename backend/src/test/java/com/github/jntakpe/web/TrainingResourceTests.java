package com.github.jntakpe.web;

import com.github.jntakpe.TrainingRatingApplication;
import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Training;
import com.github.jntakpe.service.TrainingService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

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
@WebIntegrationTest
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = TrainingRatingApplication.class)
public class TrainingResourceTests {

    @Autowired
    private TrainingService trainingService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonConverter;

    @Mock
    private TrainingService mockTrainingService;

    private MockMvc realMvc;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.realMvc = MockMvcBuilders.standaloneSetup(new TrainingResource(trainingService))
                .setMessageConverters(jacksonConverter)
                .build();
        this.mockMvc = MockMvcBuilders.standaloneSetup(new TrainingResource(mockTrainingService))
                .setMessageConverters(jacksonConverter)
                .build();
    }

    @Test
    public void findAll_shouldFind() throws Exception {
        ResultActions requestResult = realMvc.perform(get(UriConstants.TRAINING).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(requestResult);
        expectArrayNotEmpty(requestResult);
        requestResult.andDo(print());
        requestResult.andExpect(jsonPath("$.[*].name").isNotEmpty());
    }

    @Test
    public void findAll_shouldNotFind() throws Exception {
        when(mockTrainingService.findAll()).thenReturn(Collections.emptyList());
        ResultActions requestResult = mockMvc.perform(get(UriConstants.TRAINING).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(requestResult);
        expectArrayEmpty(requestResult);
    }

    @Test
    public void create_shouldCreate() throws Exception {
        String locationName = "some location";
        Training training = new Training(locationName, 3);
        ResultActions requestResult = realMvc.perform(post(UriConstants.TRAINING)
                .content(jacksonConverter.getObjectMapper().writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsCreatedAndJsonContent(requestResult);
        expectObjectExists(requestResult);
        requestResult.andExpect(jsonPath("$.name").value(locationName));
    }

    @Test
    public void create_shouldFailCuzMissingValue() throws Exception {
        Training training = new Training("fail", null);
        ResultActions requestResult = realMvc.perform(post(UriConstants.TRAINING)
                .content(jacksonConverter.getObjectMapper().writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        requestResult.andExpect(status().isBadRequest());
    }

    @Test
    public void update_shouldUpdate() throws Exception {
        Training training = trainingService.findAll().stream().findAny().orElseThrow(() -> new IllegalStateException("No training"));
        String updatedName = "web updated training";
        training.setName(updatedName);
        ResultActions requestResult = realMvc.perform(put(UriConstants.TRAINING + "/{id}", training.getId())
                .content(jacksonConverter.getObjectMapper().writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(requestResult);
        expectObjectExists(requestResult);
        requestResult.andExpect(jsonPath("$.name").value(updatedName));
    }

    @Test
    public void update_shouldFailCuzMissingValue() throws Exception {
        Training training = trainingService.findAll().stream().findAny().orElseThrow(() -> new IllegalStateException("No training"));
        training.setDuration(null);
        ResultActions requestResult = realMvc.perform(put(UriConstants.TRAINING + "/{id}", training.getId())
                .content(jacksonConverter.getObjectMapper().writeValueAsBytes(training))
                .contentType(MediaType.APPLICATION_JSON));
        requestResult.andExpect(status().isBadRequest());
    }

}
