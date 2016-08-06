package com.github.jntakpe.service;

import com.github.jntakpe.model.Rating;
import com.github.jntakpe.utils.RatingTestsUtils;
import com.github.jntakpe.utils.SessionTestsUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.junit4.SpringRunner;

import javax.validation.ValidationException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * Tests associés à l'entité {@link Rating}
 *
 * @author jntakpe
 */
@SpringBootTest
@RunWith(SpringRunner.class)
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
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void rate_shouldCreate() {
        Rating rating = ratingTestsUtils.newRating();
        Long sessionId = sessionTestsUtils.findUnusedSession().getId();
        Rating saved = ratingService.rate(sessionId, rating);
        assertThat(saved).isNotNull();
        assertThat(countRowsInCurrentTable()).isEqualTo(nbEntries + 1);
    }

    @Test(expected = ValidationException.class)
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void rate_shouldFailCuzSameSessionAndEmployee() {
        Rating rating = ratingTestsUtils.newRating();
        Long employeeId = 1L;
        Long sessionId = ratingTestsUtils.findRatingsWithEmployeeId(employeeId).stream()
                .findAny()
                .map(r -> r.getSession().getId())
                .orElseThrow(() -> new IllegalStateException("no session corresponding with employee id " + employeeId));
        ratingService.rate(sessionId, rating);
        fail("should have failed at this point");
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void rate_shouldUpdate() {
        Rating rating = ratingTestsUtils.findAnyRating();
        ratingTestsUtils.detach(rating);
        Integer updatedAnim = 2;
        rating.setAnimation(updatedAnim);
        ratingService.rate(rating.getSession().getId(), rating);
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
