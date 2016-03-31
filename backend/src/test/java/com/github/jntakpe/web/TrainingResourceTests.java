package com.github.jntakpe.web;

import com.github.jntakpe.TrainingRatingApplication;
import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.service.TrainingService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static com.github.jntakpe.web.WebTestsUtils.expectArrayNotEmpty;
import static com.github.jntakpe.web.WebTestsUtils.expectIsOkAndJsonContent;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

    private MockMvc realMvc;

    @Before
    public void setUp() {
        this.realMvc = MockMvcBuilders.standaloneSetup(new TrainingResource(trainingService)).build();
    }

    @Test
    public void findAll_shouldFind() throws Exception {
        ResultActions request = realMvc.perform(get(UriConstants.TRAINING).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(request);
        expectArrayNotEmpty(request);
        request.andExpect(jsonPath("$.[*].name").isNotEmpty());
    }
}
