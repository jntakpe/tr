package com.github.jntakpe.web;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.config.properties.OAuth2Properties;
import com.github.jntakpe.model.Location;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Base64;
import java.util.Map;
import java.util.StringJoiner;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

    public static final String ACCESS_TOKEN_KEY = "access_token";

    public static final String REFRESH_TOKEN_KEY = "refresh_token";

    protected MockMvc realMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private OAuth2Properties oAuth2Properties;

    @Autowired
    private ObjectMapper objectMapper;

    private String authorizationHeader;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.realMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).apply(springSecurity()).build();
        String clientSecret = new StringJoiner(":").add(oAuth2Properties.getClientId()).add(oAuth2Properties.getSecret()).toString();
        this.authorizationHeader = "Basic " + Base64.getEncoder().encodeToString(clientSecret.getBytes());
    }

    @Test
    public void token_shouldReturnAcccessToken() throws Exception {
        ResultActions resultActions = realMvc.perform(buildTokenRequest("jntakpe", "test").accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        resultActions.andExpect(jsonPath("$." + ACCESS_TOKEN_KEY).exists());
        resultActions.andExpect(jsonPath("$." + REFRESH_TOKEN_KEY).exists());
        resultActions.andExpect(jsonPath("$.expires_in").exists());
        resultActions.andExpect(jsonPath("$.token_type").exists());
    }

    @Test
    public void token_should400CuzWrongPwd() throws Exception {
        ResultActions resultActions = realMvc.perform(buildTokenRequest("jntakpe", "wrongpwd").accept(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void token_should400CuzWrongUsername() throws Exception {
        ResultActions resultActions = realMvc.perform(buildTokenRequest("test", "test").accept(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void unauthorizedCall_should401CuzNotConnected() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.LOCATIONS).accept(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isUnauthorized());
    }

    @Test
    public void unauthorizedCall_should403CuzInsuficientRights() throws Exception {
        String accessToken = getTokenMap("jguerrin", "test").get(ACCESS_TOKEN_KEY);
        assertThat(accessToken).isNotNull();
        String bearerToken = fromAccessTokenToBearer(accessToken);
        ResultActions resultActions = realMvc.perform(post(UriConstants.LOCATIONS)
                .header(AUTHORIZATION_HEADER_KEY, bearerToken)
                .content(objectMapper.writeValueAsBytes(new Location()))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isForbidden());
    }

    @Test
    public void authorizedCall_should200() throws Exception {
        String accessToken = getTokenMap("jntakpe", "test").get(ACCESS_TOKEN_KEY);
        assertThat(accessToken).isNotNull();
        String bearerToken = fromAccessTokenToBearer(accessToken);
        ResultActions resultActions = realMvc.perform(get(UriConstants.LOCATIONS)
                .header(AUTHORIZATION_HEADER_KEY, bearerToken)
                .accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
    }

    @Test
    public void refreshAccessToken_shouldGetNewAccessToken() throws Exception {
        Map<String, String> tokenMap = getTokenMap("jntakpe", "test");
        String refreshToken = tokenMap.get(REFRESH_TOKEN_KEY);
        String oldAccessToken = tokenMap.get(ACCESS_TOKEN_KEY);
        ResultActions resultActions = realMvc.perform(post("/oauth/token")
                .header(AUTHORIZATION_HEADER_KEY, authorizationHeader)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("grant_type", "refresh_token")
                .param(REFRESH_TOKEN_KEY, refreshToken));
        expectIsOkAndJsonContent(resultActions);
        resultActions.andExpect(jsonPath("$." + ACCESS_TOKEN_KEY).exists());
        Map<String, String> refreshedTokenMap = tokenMapFromResultActions(resultActions);
        assertThat(refreshedTokenMap.get(ACCESS_TOKEN_KEY)).isNotEqualTo(oldAccessToken);
    }

    private String fromAccessTokenToBearer(String accessToken) {
        return "Bearer " + accessToken;
    }

    private Map<String, String> getTokenMap(String username, String password) throws Exception {
        ResultActions resultActions = realMvc.perform(buildTokenRequest(username, password).accept(MediaType.APPLICATION_JSON));
        return tokenMapFromResultActions(resultActions);
    }

    private Map<String, String> tokenMapFromResultActions(ResultActions resultActions) throws java.io.IOException {
        MockHttpServletResponse response = resultActions.andReturn().getResponse();
        TypeReference<Map<String, String>> mapTypeRef = new TypeReference<Map<String, String>>() {
        };
        return objectMapper.readValue(response.getContentAsByteArray(), mapTypeRef);
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
