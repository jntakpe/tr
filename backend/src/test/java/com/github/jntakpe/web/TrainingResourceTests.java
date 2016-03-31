package com.github.jntakpe.web;

import com.github.jntakpe.TrainingRatingApplication;
import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.service.TrainingService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static com.github.jntakpe.web.WebTestsUtils.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/**
 * Tests associés à la ressource REST {@link TrainingResource}
 *
 * @author jntakpe
 */
@IntegrationTest
@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = TrainingRatingApplication.class)
public class TrainingResourceTests {

    @Autowired
    private TrainingService trainingService;

    @Mock
    private TrainingService mockTrainingService;

    private MockMvc realMvc;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.realMvc = MockMvcBuilders.standaloneSetup(new TrainingResource(trainingService)).build();
        this.mockMvc = MockMvcBuilders.standaloneSetup(new TrainingResource(mockTrainingService)).build();
    }

    @Test
    public void findAll_shouldFind() throws Exception {
        ResultActions requestResult = realMvc.perform(get(UriConstants.TRAINING).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(requestResult);
        expectArrayNotEmpty(requestResult);
        requestResult.andExpect(jsonPath("$.[*].name").isNotEmpty());
    }

    @Test
    public void findAll_shouldNotFind() throws Exception {
        when(mockTrainingService.findAll()).thenReturn(Collections.emptyList());
        ResultActions requestResult = mockMvc.perform(get(UriConstants.TRAINING).accept(MediaType.APPLICATION_JSON));
        requestResult.andDo(print());
        expectIsOkAndJsonContent(requestResult);
        expectArrayEmpty(requestResult);
    }
}
