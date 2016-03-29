package com.github.jntakpe.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Configuration de la persistence
 *
 * @author jntakpe
 */
@Configuration
@EnableJpaRepositories("com.github.jntakpe.repository")
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
public class PersistenceConfig {

}
