package com.github.jntakpe.config;

import com.github.jntakpe.config.properties.ApiProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

import static springfox.documentation.builders.PathSelectors.regex;

/**
 * Configuration de Swagger
 *
 * @author jntakpe
 */
@Configuration
@EnableSwagger2
@Profile("!" + ProfileConstants.PROD)
public class SwaggerConfig {

    public static final String DEFAULT_INCLUDE_PATTERN = "/api/.*";

    private final ApiProperties apiProperties;

    @Autowired
    public SwaggerConfig(ApiProperties apiProperties) {
        this.apiProperties = apiProperties;
    }

    @Bean
    public Docket swaggerDocket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(getApiInfo())
                .forCodeGeneration(true)
                .genericModelSubstitutes(ResponseEntity.class)
                .directModelSubstitute(Instant.class, Date.class)
                .directModelSubstitute(LocalDate.class, Date.class)
                .directModelSubstitute(LocalDateTime.class, Date.class)
                .select()
                .paths(regex(DEFAULT_INCLUDE_PATTERN))
                .build();
    }

    private ApiInfo getApiInfo() {
        return new ApiInfo(apiProperties.getTitle(),
                apiProperties.getDescription(),
                apiProperties.getVersion(),
                apiProperties.getTermsOfServiceUrl(),
                getContact(),
                apiProperties.getLicense(),
                apiProperties.getLicenseUrl());
    }

    private Contact getContact() {
        ApiProperties.Contact contactProperties = apiProperties.getContact();
        return new Contact(contactProperties.getName(), contactProperties.getUrl(), contactProperties.getMail());
    }
}
