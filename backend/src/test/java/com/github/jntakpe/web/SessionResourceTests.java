package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.service.EmployeeServiceTests;
import com.github.jntakpe.service.SessionService;
import com.github.jntakpe.utils.SessionTestsUtils;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.ResultActions;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * Tests associés à la ressource REST {@link SessionResource}
 *
 * @author jntakpe
 */
public class SessionResourceTests extends AbstractResourceTests {

    @Autowired
    private SessionTestsUtils sessionTestsUtils;

    @Mock
    private SessionService mockSessionService;

    @Override
    public Object getMockResource() {
        return new SessionResource(mockSessionService);
    }

    @Test
    public void findAll_shouldFind() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.SESSIONS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        resultActions.andExpect(jsonPath("$.totalElements").value(sessionTestsUtils.count()));
        resultActions.andExpect(jsonPath("$.size").value(10));
        resultActions.andExpect(jsonPath("$.number").value(0));
        resultActions.andExpect(jsonPath("$.content").isArray());
        resultActions.andExpect(jsonPath("$.content", Matchers.hasSize(10)));
    }

    @Test
    public void findAll_shouldFindAndPaginate() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.SESSIONS)
                .param("page", "1")
                .param("size", "2")
                .accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        resultActions.andExpect(jsonPath("$.totalElements").value(sessionTestsUtils.count()));
        resultActions.andExpect(jsonPath("$.size").value(2));
        resultActions.andExpect(jsonPath("$.number").value(1));
        resultActions.andExpect(jsonPath("$.content").isArray());
        resultActions.andExpect(jsonPath("$.content", Matchers.hasSize(2)));
    }

    @Test
    public void findAll_shouldFindAndFilter() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.SESSIONS)
                .param("location.city", "toulouse")
                .param("location.name", "colo1")
                .param("training.name", "angularJS")
                .accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        resultActions.andExpect(jsonPath("$.totalElements").value(5));
        resultActions.andExpect(jsonPath("$.size").value(10));
        resultActions.andExpect(jsonPath("$.number").value(0));
        resultActions.andExpect(jsonPath("$.content").isArray());
        resultActions.andExpect(jsonPath("$.content", Matchers.hasSize(5)));
    }

    @Test
    public void findAll_shouldFindFilterAndPaginate() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.SESSIONS)
                .param("location.city", "toulouse")
                .param("location.name", "colo1")
                .param("training.name", "angularJS")
                .param("page", "1")
                .param("size", "2")
                .accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        resultActions.andExpect(jsonPath("$.totalElements").value(5));
        resultActions.andExpect(jsonPath("$.size").value(2));
        resultActions.andExpect(jsonPath("$.number").value(1));
        resultActions.andExpect(jsonPath("$.content").isArray());
        resultActions.andExpect(jsonPath("$.content", Matchers.hasSize(2)));
    }

    @Test
    public void findById_shouldFind() throws Exception {
        Long sessionId = sessionTestsUtils.findAnySession().getId();
        ResultActions resultActions = realMvc.perform(get(UriConstants.SESSIONS + "/{id}", sessionId)
                .accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.start").isNotEmpty());
        resultActions.andExpect(jsonPath("$.location.id").isNotEmpty());
        resultActions.andExpect(jsonPath("$.training.id").isNotEmpty());
        resultActions.andExpect(jsonPath("$.trainer.id").isNotEmpty());
    }

    @Test
    public void findById_shouldNotFind() throws Exception {
        realMvc.perform(get(UriConstants.SESSIONS + "/{id}", 9999L)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is(404));
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void create_shouldCreate() throws Exception {
        LocalDate startDate = LocalDate.of(2016, 2, 2);
        Session session = sessionTestsUtils.getSessionWithDetachedRelationsAndRatings(startDate);
        ResultActions resultActions = realMvc.perform(post(UriConstants.SESSIONS)
                .content(objectMapper.writeValueAsBytes(session))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsCreatedAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.id").isNumber());
        resultActions.andExpect(jsonPath("$.start").value(startDate.toString()));
        resultActions.andExpect(jsonPath("$.trainer.id").exists());
        resultActions.andExpect(jsonPath("$.trainer.login").exists());
        resultActions.andExpect(jsonPath("$.location.id").exists());
        resultActions.andExpect(jsonPath("$.location.name").exists());
        resultActions.andExpect(jsonPath("$.training.id").exists());
        resultActions.andExpect(jsonPath("$.training.name").exists());
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
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void update_shouldUpdate() throws Exception {
        Session session = sessionTestsUtils.findAnySessionInitialized();
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
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void delete_shouldDelete() throws Exception {
        Session session = sessionTestsUtils.findUnusedSession();
        ResultActions resultActions = realMvc.perform(delete(UriConstants.SESSIONS + "/{id}", session.getId())
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNoContent());
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void delete_shouldFailCuzIdDoesntExist() throws Exception {
        ResultActions resultActions = realMvc.perform(delete(UriConstants.SESSIONS + "/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNotFound());
    }
}
