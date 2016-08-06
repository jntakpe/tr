package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.service.RatingService;
import com.github.jntakpe.utils.RatingTestsUtils;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

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
}
