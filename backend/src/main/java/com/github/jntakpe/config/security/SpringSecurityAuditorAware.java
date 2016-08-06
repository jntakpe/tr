package com.github.jntakpe.config.security;

import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

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
        return SecurityUtils.getCurrentUser().map(SpringSecurityUser::getUsername).orElse(SecurityUtils.SYSTEM_USER);
    }
}
