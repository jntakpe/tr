package com.github.jntakpe.service;

import com.github.jntakpe.model.Rating;
import com.github.jntakpe.utils.RatingTestsUtils;
import com.github.jntakpe.utils.SessionTestsUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ValidationException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * Tests associés à l'entité {@link Rating}
 *
 * @author jntakpe
 */
public class RatingServiceTests extends AbstractDBServiceTests {

    public static final String TABLE_NAME = "rating";

    @Autowired
    private RatingService ratingService;

    @Autowired
    private RatingTestsUtils ratingTestsUtils;

    @Autowired
    private SessionTestsUtils sessionTestsUtils;

    @Test
    public void findBySessionId_shouldFind() {
        Long sessionId = ratingTestsUtils.findExistingSessionId();
        String request = "SELECT COUNT(0) FROM " + TABLE_NAME + " WHERE session_id='" + sessionId + "'";
        Integer expectedSize = jdbcTemplate.queryForObject(request, Integer.class);
        assertThat(ratingService.findBySessionId(sessionId)).isNotEmpty().hasSize(expectedSize);
    }

    @Test
    public void save_shouldCreate() {
        Rating rating = ratingTestsUtils.newRating();
        Long sessionId = sessionTestsUtils.findUnusedSession().getId();
        Rating saved = ratingService.save(rating, sessionId);
        assertThat(saved).isNotNull();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test(expected = ValidationException.class)
    public void save_shouldFailCuzSameSessionAndEmployee() {
        Rating rating = ratingTestsUtils.newRating();
        Long employeeId = 1L;
        Long sessionId = ratingTestsUtils.findRatingsWithEmployeeId(employeeId).stream()
                .findAny()
                .map(r -> r.getSession().getId())
                .orElseThrow(() -> new IllegalStateException("no session corresponding with employee id " + employeeId));
        ratingService.save(rating, sessionId);
        fail("should have failed at this point");
    }

    @Test
    public void save_shouldUpdate() {
        Rating rating = ratingTestsUtils.findAnyRating();
        ratingTestsUtils.detach(rating);
        Integer updatedAnim = 2;
        rating.setAnimation(updatedAnim);
        ratingService.save(rating, rating.getSession().getId());
        ratingTestsUtils.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE id='" + rating.getId() + "'";
        Rating result = jdbcTemplate.queryForObject(query, (rs, rowNum) -> {
            Rating mapper = new Rating();
            mapper.setAnimation(rs.getInt("animation"));
            return mapper;
        });
        assertThat(result).isNotNull();
        assertThat(result.getAnimation()).isEqualTo(updatedAnim);
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

}
