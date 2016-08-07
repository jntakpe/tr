package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.service.RatingService;
import com.github.jntakpe.utils.EmployeeTestUtils;
import com.github.jntakpe.utils.RatingTestsUtils;
import com.github.jntakpe.utils.SessionTestsUtils;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests associés à la ressource REST {@link RatingResource}
 *
 * @author jntakpe
 */
public class RatingResourceTests extends AbstractResourceTests {

    @Autowired
    private RatingTestsUtils ratingTestsUtils;

    @Autowired
    private EmployeeTestUtils employeeTestUtils;

    @Autowired
    private SessionTestsUtils sessionTestsUtils;

    @Mock
    private RatingService mockRatingService;

    @Override
    public Object getMockResource() {
        return new RatingResource(mockRatingService);
    }

    @Test
    public void findBySessionId_shouldFind() throws Exception {
        Long sessionId = ratingTestsUtils.findExistingSessionId();
        ResultActions resultActions = realMvc.perform(get(UriConstants.RATINGS_BY_SESSION, sessionId).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
        resultActions.andExpect(jsonPath("$.[*].subject").isNotEmpty());
    }

    @Test
    public void findBySessionId_shouldNotFind() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.RATINGS_BY_SESSION, 999L).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayEmpty(resultActions);
    }

    @Test
    public void registerToSession_shouldRegister() throws Exception {
        Employee employee = employeeTestUtils.findDefaultEmployee();
        employeeTestUtils.detach(employee);
        Session session = sessionTestsUtils.findUnusedSession();
        ResultActions resultActions = realMvc.perform(post(UriConstants.RATINGS_BY_SESSION, session.getId())
                .content(objectMapper.writeValueAsBytes(employee))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsCreatedAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.session.id").isNumber()).andExpect(jsonPath("$.session.id").value(session.getId().intValue()));
    }

    @Test
    public void registerToSession_shouldFailCuzNoLogin() throws Exception {
        Employee employee = employeeTestUtils.findDefaultEmployee();
        employeeTestUtils.detach(employee);
        employee.setLogin(null);
        Session session = sessionTestsUtils.findUnusedSession();
        ResultActions resultActions = realMvc.perform(post(UriConstants.RATINGS_BY_SESSION, session.getId())
                .content(objectMapper.writeValueAsBytes(employee))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

}
