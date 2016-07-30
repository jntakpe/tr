package com.github.jntakpe.service;

import com.github.jntakpe.entity.Rating;
import com.github.jntakpe.utils.RatingTestsUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests associés à l'entité {@link Rating}
 *
 * @author jntakpe
 */
public class RatingServiceTests extends AbstractServiceTests {

    public static final String TABLE_NAME = "rating";

    @Autowired
    private RatingService ratingService;

    @Autowired
    private RatingTestsUtils ratingTestsUtils;

    @Test
    public void findBySessionId_shouldFind() {
        Long sessionId = ratingTestsUtils.findExistingSessingId();
        String request = "SELECT COUNT(0) FROM " + TABLE_NAME + " WHERE session_id='" + sessionId + "'";
        Integer expectedSize = jdbcTemplate.queryForObject(request, Integer.class);
        assertThat(ratingService.findBySessionId(sessionId)).isNotEmpty().hasSize(expectedSize);
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

}
