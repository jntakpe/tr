package com.github.jntakpe.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Session;
import com.github.jntakpe.service.SessionService;
import com.github.jntakpe.utils.SessionTestsUtils;
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

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * Tests associés à la ressource REST {@link SessionResource}
 *
 * @author jntakpe
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public class SessionResourceTests implements WebTestsUtils {

    @Autowired
    private SessionTestsUtils sessionTestsUtils;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private SessionService mockSessionService;

    private MockMvc realMvc;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.realMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
        this.mockMvc = MockMvcBuilders.standaloneSetup(new SessionResource(mockSessionService)).build();
    }

    @Test
    public void findAll_shouldFind() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.SESSIONS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
        resultActions.andExpect(jsonPath("$.[*].start").isNotEmpty());
    }

    @Test
    public void findAll_shouldNotFind() throws Exception {
        when(mockSessionService.findAll()).thenReturn(Collections.emptyList());
        ResultActions resultActions = mockMvc.perform(get(UriConstants.SESSIONS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayEmpty(resultActions);
    }

    @Test
    public void create_shouldCreate() throws Exception {
        LocalDate startDate = LocalDate.of(2016, 2, 2);
        Session session = sessionTestsUtils.getSessionWithDetachedRelations(startDate);
        ResultActions resultActions = realMvc.perform(post(UriConstants.SESSIONS)
                .content(objectMapper.writeValueAsBytes(session))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsCreatedAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.id").isNumber());
        resultActions.andExpect(jsonPath("$.start").value(startDate.toString()));
    }

    @Test
    public void create_shouldFailCuzMissingValue() throws Exception {
        Session session = sessionTestsUtils.getSessionWithDetachedRelations(LocalDate.of(2016, 3, 3));
        session.setStart(null);
        ResultActions resultActions = realMvc.perform(post(UriConstants.SESSIONS)
                .content(objectMapper.writeValueAsBytes(session))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void create_shouldFailCuzMissingValueInRelation() throws Exception {
        Session session = sessionTestsUtils.getSessionWithDetachedRelations(LocalDate.of(2016, 4, 4));
        session.getLocation().setName(null);
        ResultActions resultActions = realMvc.perform(post(UriConstants.SESSIONS)
                .content(objectMapper.writeValueAsBytes(session))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void update_shouldUpdate() throws Exception {
        Session session = sessionTestsUtils.findAnySession();
        LocalDate updatedDate = LocalDate.of(2016, 10, 10);
        session.setStart(updatedDate);
        ResultActions resultActions = realMvc.perform(put(UriConstants.SESSIONS + "/{id}", session.getId())
                .content(objectMapper.writeValueAsBytes(session))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.start").value(updatedDate.toString()));
    }

    @Test
    public void update_shouldFailCuzMissingValue() throws Exception {
        Session session = sessionTestsUtils.findAnySession();
        session.setStart(null);
        ResultActions resultActions = realMvc.perform(put(UriConstants.SESSIONS + "/{id}", session.getId())
                .content(objectMapper.writeValueAsBytes(session))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void delete_shouldDelete() throws Exception {
        Session session = sessionTestsUtils.findAnySession();
        ResultActions resultActions = realMvc.perform(delete(UriConstants.SESSIONS + "/{id}", session.getId())
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNoContent());
    }

    @Test
    public void delete_shouldFailCuzIdDoesntExist() throws Exception {
        ResultActions resultActions = realMvc.perform(delete(UriConstants.SESSIONS + "/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNotFound());
    }
}
