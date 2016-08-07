package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Rating;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.service.EmployeeServiceTests;
import com.github.jntakpe.service.RatingService;
import com.github.jntakpe.utils.RatingTestsUtils;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
        Employee employee = ratingTestsUtils.findAnyDetachedEmployee();
        Session session = ratingTestsUtils.findUnusedDetachedSession();
        ResultActions resultActions = realMvc.perform(post(UriConstants.RATINGS_BY_SESSION, session.getId())
                .content(objectMapper.writeValueAsBytes(employee))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsCreatedAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.session.id").isNumber()).andExpect(jsonPath("$.session.id").value(session.getId().intValue()));
    }

    @Test
    public void registerToSession_shouldFailCuzNoLogin() throws Exception {
        Employee employee = ratingTestsUtils.findAnyDetachedEmployee();
        employee.setLogin(null);
        Session session = ratingTestsUtils.findUnusedDetachedSession();
        ResultActions resultActions = realMvc.perform(post(UriConstants.RATINGS_BY_SESSION, session.getId())
                .content(objectMapper.writeValueAsBytes(employee))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void rateSession_shouldRate() throws Exception {
        Rating rating = ratingTestsUtils.findAnyRatingForConnectedUser();
        ratingTestsUtils.detach(rating);
        String pros = "Super comment";
        rating.setPros(pros);
        ResultActions resultActions = realMvc.perform(
                put(UriConstants.RATINGS_BY_SESSION + "/{ratingId}", rating.getSession().getId(), rating.getId())
                        .content(objectMapper.writeValueAsBytes(rating))
                        .contentType(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        resultActions.andExpect(jsonPath("$.pros").isString()).andExpect(jsonPath("$.pros").value(pros));
    }

    @Test
    public void unregisterFromSession_shouldUnregister() throws Exception {
        Rating rating = ratingTestsUtils.findAnyRating();
        ResultActions resultActions = realMvc.perform(
                delete(UriConstants.RATINGS_BY_SESSION + "/{ratingId}", rating.getSession().getId(), rating.getId())
                        .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNoContent());
    }
}
