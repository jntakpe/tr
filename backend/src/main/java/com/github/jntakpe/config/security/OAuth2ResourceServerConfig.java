package com.github.jntakpe.config.security;

import com.github.jntakpe.config.UriConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

/**
 * Configuration du serveur de ressources OAuth2
 *
 * @author jntakpe
 * @see ResourceServerConfigurerAdapter
 */
@Configuration
@EnableResourceServer
public class OAuth2ResourceServerConfig extends ResourceServerConfigurerAdapter {

    public static final String LOGOUT_URL = UriConstants.API + "/logout";

    private final ResourceServerTokenServices resourceServerTokenServices;

    private final LogoutSuccessHandler logoutSuccessHandler;

    private final AuthenticationEntryPoint authenticationEntryPoint;

    @Autowired
    public OAuth2ResourceServerConfig(ResourceServerTokenServices resourceServerTokenServices,
                                      LogoutSuccessHandler logoutSuccessHandler,
                                      AuthenticationEntryPoint authenticationEntryPoint) {
        this.resourceServerTokenServices = resourceServerTokenServices;
        this.logoutSuccessHandler = logoutSuccessHandler;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.tokenServices(resourceServerTokenServices);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
                .exceptionHandling().authenticationEntryPoint(authenticationEntryPoint).and()
                .logout().logoutUrl(LOGOUT_URL).logoutSuccessHandler(logoutSuccessHandler).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .csrf().disable().headers().frameOptions().disable().and()
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .antMatchers("/api/authenticate").permitAll()
                .antMatchers("/api/**").permitAll()
                .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
                .antMatchers("/v2/api-docs/**").permitAll()
                .antMatchers("/swagger-resources/configuration/ui").permitAll()
                .antMatchers("/swagger-ui/index.html").hasAuthority(AuthoritiesConstants.ADMIN);
    }
}
