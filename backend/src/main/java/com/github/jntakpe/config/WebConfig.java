package com.github.jntakpe.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration de l'API REST
 *
 * @author jntakpe
 */
@Configuration
public class WebConfig {

    @Bean
    public Module registerJavaTimeModule() {
        return new JavaTimeModule();
    }

}
