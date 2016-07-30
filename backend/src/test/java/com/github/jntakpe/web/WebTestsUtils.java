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

    default ResultActions expectIsOkAndJsonContent(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    default ResultActions expectIsCreatedAndJsonContent(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    default ResultActions expectArrayNotEmpty(ResultActions resultActions) throws Exception {
        return isArray(resultActions)
                .andExpect(jsonPath("$.[*]").isNotEmpty());
    }

    default ResultActions isArray(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(jsonPath("$").isArray());
    }

    default ResultActions expectArrayEmpty(ResultActions resultActions) throws Exception {
        return isArray(resultActions)
                .andExpect(jsonPath("$.[*]").isEmpty());
    }

    default ResultActions expectObjectExists(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(jsonPath("$").exists());
    }
}
