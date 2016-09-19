package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.service.EmployeeService;
import com.github.jntakpe.service.EmployeeServiceTests;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/**
 * Tests associés à la ressource REST {@link TrainerResource}
 *
 * @author jntakpe
 */
public class TrainerResourceTests extends AbstractResourceTests {

    @Mock
    private EmployeeService mockEmployeeService;

    @Override
    public Object getMockResource() {
        return new TrainerResource(mockEmployeeService);
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void findAll_shouldFind() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.TRAINERS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
        resultActions.andExpect(jsonPath("$.[*].login").isNotEmpty());
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void findAll_shouldNotFind() throws Exception {
        when(mockEmployeeService.findAllTrainers()).thenReturn(Collections.emptyList());
        ResultActions resultActions = mockMvc.perform(get(UriConstants.TRAINERS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayEmpty(resultActions);
    }
}
