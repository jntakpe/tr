package com.github.jntakpe.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Méthodes utilitaires pour les tests de ressources REST
 *
 * @author jntakpe
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public abstract class AbstractResourceTests {

    @Autowired
    protected WebApplicationContext webApplicationContext;

    @Autowired
    protected ObjectMapper objectMapper;

    protected MockMvc realMvc;

    protected MockMvc mockMvc;

    public abstract Object getMockResource();

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.realMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
        this.mockMvc = MockMvcBuilders.standaloneSetup(getMockResource()).build();
    }

    ResultActions expectIsOkAndJsonContent(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    ResultActions expectIsCreatedAndJsonContent(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    ResultActions expectArrayNotEmpty(ResultActions resultActions) throws Exception {
        return isArray(resultActions)
                .andExpect(jsonPath("$.[*]").isNotEmpty());
    }

    ResultActions isArray(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(jsonPath("$").isArray());
    }

    ResultActions expectArrayEmpty(ResultActions resultActions) throws Exception {
        return isArray(resultActions)
                .andExpect(jsonPath("$.[*]").isEmpty());
    }

    ResultActions expectObjectExists(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(jsonPath("$").exists());
    }

}
