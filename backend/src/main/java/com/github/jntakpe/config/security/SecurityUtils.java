package com.github.jntakpe.config.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * Méthodes utilitaires de gestion de la sécurité
 *
 * @author jntakpe
 */
public final class SecurityUtils {

    public static final String SYSTEM_USER = "system";

    private SecurityUtils() {
    }

    public static Optional<SpringSecurityUser> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof SpringSecurityUser) {
            SpringSecurityUser securityUser = (SpringSecurityUser) authentication.getPrincipal();
            return Optional.of(securityUser);
        }
        return Optional.empty();
    }

    public static SpringSecurityUser getCurrentUserOrThrow() {
        return getCurrentUser().orElseThrow(() -> new IllegalStateException("Impossible de récupérer l'utilisateur courant"));
    }
}
