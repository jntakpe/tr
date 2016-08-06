package com.github.jntakpe.web;

import com.github.jntakpe.config.properties.OAuth2Properties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.Filter;
import java.util.Base64;
import java.util.StringJoiner;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests associés à la resource OAuth2 permettant l'authentification d'un utilisateur
 *
 * @author jntakpe
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public class AuthenticationResourceTests implements RessourceExpectation {

    public static final String AUTHORIZATION_HEADER_KEY = "Authorization";

    protected MockMvc realMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private Filter springSecurityFilterChain;

    @Autowired
    private OAuth2Properties oAuth2Properties;

    private String authorizationHeader;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.realMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).addFilters(springSecurityFilterChain).build();
        String clientSecret = new StringJoiner(":").add(oAuth2Properties.getClientId()).add(oAuth2Properties.getSecret()).toString();
        this.authorizationHeader = "Basic " + Base64.getEncoder().encodeToString(clientSecret.getBytes());
    }

    @Test
    public void token_shouldReturnAcccessToken() throws Exception {
        ResultActions resultActions = realMvc.perform(buildTokenRequest("jntakpe", "test").accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        resultActions.andExpect(jsonPath("$.access_token").exists());
        resultActions.andExpect(jsonPath("$.refresh_token").exists());
        resultActions.andExpect(jsonPath("$.expires_in").exists());
        resultActions.andExpect(jsonPath("$.token_type").exists());
    }

    @Test
    public void token_should400CuzWrongPwd() throws Exception {
        ResultActions resultActions = realMvc.perform(buildTokenRequest("jntakpe", "wrongpwd").accept(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void test_should400CuzWrongUsername() throws Exception {
        ResultActions resultActions = realMvc.perform(buildTokenRequest("test", "test").accept(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    private MockHttpServletRequestBuilder buildTokenRequest(String username, String password) {
        return post("/oauth/token")
                .header(AUTHORIZATION_HEADER_KEY, authorizationHeader)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("username", username)
                .param("password", password)
                .param("scope", "read write")
                .param("client_id", oAuth2Properties.getClientId())
                .param("secret", oAuth2Properties.getSecret())
                .param("grant_type", "password");
    }


}
