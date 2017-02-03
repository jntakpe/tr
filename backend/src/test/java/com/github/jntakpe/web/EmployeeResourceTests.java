package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.service.EmployeeService;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

/**
 * Tests associés à la ressource REST {@link Employee}
 *
 * @author jntakpe
 */
public class EmployeeResourceTests extends AbstractResourceTests {

    @Mock
    private EmployeeService mockEmployeeService;

    @Override
    public Object getMockResource() {
        return new EmployeeResource(mockEmployeeService);
    }

    @Test
    public void findStartingByLogin_shouldFindOne() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.EMPLOYEES + "/login/{login}", "jnta")
                .accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
        resultActions.andExpect(jsonPath("$.[0].login").value("jntakpe"));
    }

    @Test
    public void findStartingByLogin_shouldFindSome() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.EMPLOYEES + "/login/{login}", "j")
                .accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
        resultActions.andExpect(jsonPath("$.[*].login", Matchers.contains("jntakpe", "jguerrin")));
    }

    @Test
    public void findStartingByLogin_shouldFindEmpty() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.EMPLOYEES + "/login/{login}", "waz")
                .accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayEmpty(resultActions);
    }

}
