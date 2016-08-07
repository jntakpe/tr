package com.github.jntakpe.config.security;

import com.github.jntakpe.model.Authority;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.github.jntakpe.config.security.SpringSecurityUser.ROLE_PREFIX;

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
        return getCurrentUser().orElseThrow(() -> new UsernameNotFoundException("Impossible de récupérer l'utilisateur courant"));
    }

    public static List<SimpleGrantedAuthority> authoritiesToSimpleGrant(Set<Authority> authorities) {
        if (authorities.isEmpty()) {
            return Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        }
        return authorities.stream()
                .map(a -> new SimpleGrantedAuthority(ROLE_PREFIX + a.getName()))
                .collect(Collectors.toList());
    }
}
