package com.github.jntakpe.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Propriétés relatives à l'authentification OAuth2
 *
 * @author jntakpe
 */
@Component
@ConfigurationProperties("oauth2")
public class OAuth2Properties {

    private String clientId = "trainingrating";

    private String secret = "supertrainingratingsecret";

    private Integer accessTokenValiditySeconds = 180;

    private Integer refreshTokenValidityMinutes = 60;

    private Integer ldapCheckIntervalInHours = 48;

    private String keystoreKey;

    private String keystorePass;

    private String keystoreKeyPass;

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

    public Integer getAccessTokenValiditySeconds() {
        return accessTokenValiditySeconds;
    }

    public void setAccessTokenValiditySeconds(Integer accessTokenValiditySeconds) {
        this.accessTokenValiditySeconds = accessTokenValiditySeconds;
    }

    public Integer getRefreshTokenValidityMinutes() {
        return refreshTokenValidityMinutes;
    }

    public void setRefreshTokenValidityMinutes(Integer refreshTokenValidityMinutes) {
        this.refreshTokenValidityMinutes = refreshTokenValidityMinutes;
    }

    public Integer getLdapCheckIntervalInHours() {
        return ldapCheckIntervalInHours;
    }

    public void setLdapCheckIntervalInHours(Integer ldapCheckIntervalInHours) {
        this.ldapCheckIntervalInHours = ldapCheckIntervalInHours;
    }

    public String getKeystoreKey() {
        return keystoreKey;
    }

    public void setKeystoreKey(String keystoreKey) {
        this.keystoreKey = keystoreKey;
    }

    public String getKeystorePass() {
        return keystorePass;
    }

    public void setKeystorePass(String keystorePass) {
        this.keystorePass = keystorePass;
    }

    public String getKeystoreKeyPass() {
        return keystoreKeyPass;
    }

    public void setKeystoreKeyPass(String keystoreKeyPass) {
        this.keystoreKeyPass = keystoreKeyPass;
    }
}
