package com.github.jntakpe.config.security;

import com.github.jntakpe.config.ProfileConstants;
import com.github.jntakpe.config.properties.LdapProperties;
import com.github.jntakpe.mapper.LdapEmployeeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;

/**
 * Configuration de la connexion au LDAP Sopra Steria
 *
 * @author jntakpe
 */
@Configuration
@Profile(ProfileConstants.PROD)
public class LdapConfig {

    private final LdapProperties ldapProperties;

    private final LdapEmployeeMapper ldapEmployeeMapper;

    @Autowired
    public LdapConfig(LdapProperties ldapProperties, LdapEmployeeMapper ldapEmployeeMapper) {
        this.ldapProperties = ldapProperties;
        this.ldapEmployeeMapper = ldapEmployeeMapper;
    }

    @Bean
    public BindAuthenticator bindAuthenticator() {
        BindAuthenticator bindAuthenticator = new BindAuthenticator(defaultSpringSecurityContextSource());
        bindAuthenticator.setUserSearch(filterBasedLdapUserSearch());
        return bindAuthenticator;
    }

    @Bean
    public DefaultSpringSecurityContextSource defaultSpringSecurityContextSource() {
        DefaultSpringSecurityContextSource contextSource = new DefaultSpringSecurityContextSource(ldapProperties.getUrl());
        contextSource.setUserDn(ldapProperties.getBrowsing().getUserDN());
        contextSource.setPassword(ldapProperties.getBrowsing().getPassword());
        return contextSource;
    }

    @Bean
    public FilterBasedLdapUserSearch filterBasedLdapUserSearch() {
        LdapProperties.Users users = ldapProperties.getUsers();
        return new FilterBasedLdapUserSearch(users.getBase(), users.getSearch(), defaultSpringSecurityContextSource());
    }

}

