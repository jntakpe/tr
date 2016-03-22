package com.github.jntakpe.config.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Méthodes utilitaires de gestion de la sécurité
 *
 * @author jntakpe
 */
public final class SecurityUtils {

    public static final String SYSTEM_USER = "system";

    private SecurityUtils() {
    }

    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = null;
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
            userName = springSecurityUser.getUsername();
        }
        return userName;
    }
}
