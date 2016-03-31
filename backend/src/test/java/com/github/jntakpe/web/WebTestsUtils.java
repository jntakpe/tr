package com.github.jntakpe.web;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Méthodes utilitaires pour les tests web
 *
 * @author jntakpe
 */
public interface WebTestsUtils {

    static ResultActions expectIsOkAndJsonContent(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    static ResultActions expectArrayNotEmpty(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(jsonPath("$.[*]").isArray())
                .andExpect(jsonPath("$.[*]").isNotEmpty());
    }
}
