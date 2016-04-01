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

    static ResultActions expectIsCreatedAndJsonContent(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    static ResultActions expectArrayNotEmpty(ResultActions resultActions) throws Exception {
        return isArray(resultActions)
                .andExpect(jsonPath("$.[*]").isNotEmpty());
    }

    static ResultActions isArray(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(jsonPath("$").isArray());
    }

    static ResultActions expectArrayEmpty(ResultActions resultActions) throws Exception {
        return isArray(resultActions)
                .andExpect(jsonPath("$.[*]").isEmpty());
    }

    static ResultActions expectObjectExists(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(jsonPath("$").exists());
    }
}
