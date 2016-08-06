package com.github.jntakpe.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.jntakpe.config.properties.OAuth2Properties;

/**
 * Bean réprésentant une requête OAuth2
 *
 * @author jntakpe
 */
public class OAuth2Request {

    private String username;

    private String password;

    @JsonProperty("grant_type")
    private String grantType;

    private String scope;

    @JsonProperty("client_id")
    private String clientId;

    private String secret;

    public OAuth2Request() {
    }

    public OAuth2Request(String username, String password, OAuth2Properties oAuth2Properties) {
        this.username = username;
        this.password = password;
        this.grantType = "password";
        this.scope = "read write";
        this.clientId = oAuth2Properties.getClientId();
        this.secret = oAuth2Properties.getSecret();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getGrantType() {
        return grantType;
    }

    public void setGrantType(String grantType) {
        this.grantType = grantType;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }
}
