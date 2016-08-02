package com.github.jntakpe.config.security;

import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Objects;

/**
 * Récupération du nom d'utilisateur courant
 *
 * @author jntakpe
 * @see AuditorAware
 */
@Component
public class SpringSecurityAuditorAware implements AuditorAware<String> {

    @Override
    public String getCurrentAuditor() {
        String username = SecurityUtils.getCurrentUsername();
        return Objects.isNull(username) ? SecurityUtils.SYSTEM_USER : username;
    }
}
