package com.github.jntakpe.config.security;

import com.github.jntakpe.config.ProfileConstants;
import com.github.jntakpe.config.properties.LdapProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.security.ldap.userdetails.LdapUserDetails;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;
import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;

import java.util.Collection;

/**
 * Configuration de la connexion au LDAP Sopra Steria
 *
 * @author jntakpe
 */
@Configuration
@Profile(ProfileConstants.PROD)
public class LdapConfig {

    private final LdapProperties ldapProperties;

    @Autowired
    public LdapConfig(LdapProperties ldapProperties) {
        this.ldapProperties = ldapProperties;
    }

    @Bean
    protected DefaultSpringSecurityContextSource defaultSpringSecurityContextSource() {
        DefaultSpringSecurityContextSource contextSource = new DefaultSpringSecurityContextSource(ldapProperties.getUrl());
        contextSource.setUserDn(ldapProperties.getBrowsing().getUserDN());
        contextSource.setPassword(ldapProperties.getBrowsing().getPassword());
        return contextSource;
    }

    @Bean
    protected FilterBasedLdapUserSearch filterBasedLdapUserSearch() {
        LdapProperties.Users users = ldapProperties.getUsers();
        return new FilterBasedLdapUserSearch(users.getBase(), users.getSearch(), defaultSpringSecurityContextSource());
    }

    @Bean
    protected UserDetailsContextMapper userDetailsContextMapper() {
        return new LdapUserDetailsMapper() {
            @Override
            public UserDetails mapUserFromContext(DirContextOperations ctx,
                                                  String username,
                                                  Collection<? extends GrantedAuthority> authorities) {
                LdapUserDetails user = (LdapUserDetails) super.mapUserFromContext(ctx, username, authorities);
                String fisrstName = ctx.getStringAttribute(ldapProperties.getAttributes().getFisrtName());
                String lastName = ctx.getStringAttribute(ldapProperties.getAttributes().getLastName());
                String mail = ctx.getStringAttribute(ldapProperties.getAttributes().getMail());
                //return new SpringSecurityUser(user.getUsername(), user.getUsername(), null);
                return null;
            }
        };
    }

}

