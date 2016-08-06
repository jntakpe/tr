package com.github.jntakpe.config.security;

import com.github.jntakpe.config.properties.OAuth2Properties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.AccessTokenConverter;
import org.springframework.security.oauth2.provider.token.TokenStore;

/**
 * Configuration du serveur d'authorisation OAuth2
 *
 * @author jntakpe
 * @see AuthorizationServerConfigurerAdapter
 */
@Configuration
@EnableAuthorizationServer
public class OAuth2AuthServerConfig extends AuthorizationServerConfigurerAdapter {

    private final AuthenticationManager authenticationManager;

    private final TokenStore tokenStore;

    private final AccessTokenConverter accessTokenConverter;

    private final OAuth2Properties oAuth2Properties;

    private final DatabaseUserDetailsService databaseUserDetailsService;

    @Autowired
    public OAuth2AuthServerConfig(@Qualifier("authenticationManagerBean") AuthenticationManager authenticationManager,
                                  TokenStore tokenStore,
                                  AccessTokenConverter accessTokenConverter,
                                  OAuth2Properties oAuth2Properties,
                                  DatabaseUserDetailsService databaseUserDetailsService) {
        this.authenticationManager = authenticationManager;
        this.tokenStore = tokenStore;
        this.accessTokenConverter = accessTokenConverter;
        this.oAuth2Properties = oAuth2Properties;
        this.databaseUserDetailsService = databaseUserDetailsService;
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
        security
                .tokenKeyAccess("permitAll()")
                .checkTokenAccess("isAuthenticated()");
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients
                .inMemory()
                .withClient(oAuth2Properties.getClientId())
                .secret(oAuth2Properties.getSecret())
                .authorizedGrantTypes("password", "refresh_token")
                .scopes("read", "write")
                .accessTokenValiditySeconds(oAuth2Properties.getAccessTokenValiditySeconds())
                .refreshTokenValiditySeconds(oAuth2Properties.getRefreshTokenValidityMinutes() * 60);
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        endpoints
                .tokenStore(tokenStore)
                .accessTokenConverter(accessTokenConverter)
                .authenticationManager(authenticationManager)
                .userDetailsService(databaseUserDetailsService);
    }

}
