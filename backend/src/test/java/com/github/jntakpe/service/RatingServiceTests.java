package com.github.jntakpe.service;

import com.github.jntakpe.config.security.SecurityUtils;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Rating;
import com.github.jntakpe.model.Session;
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
        Integer expectedSize = countRatingWithSessionId(sessionId);
        assertThat(ratingService.findBySessionId(sessionId)).isNotEmpty().hasSize(expectedSize);
    }

    @Test
    public void register_shouldCreateNewRating() {
        Session session = sessionTestsUtils.findUnusedSession();
        Long sessionId = session.getId();
        Integer initialSessionRatings = countRatingWithSessionId(sessionId);
        Employee employee = new Employee();
        employee.setLogin("gpeel");
        Rating registration = ratingService.register(sessionId, employee);
        assertThat(registration).isNotNull();
        assertThat(countRatingWithSessionId(sessionId)).isEqualTo(initialSessionRatings + 1);
    }

    @Test(expected = ValidationException.class)
    public void register_shouldFailCuzAlreadyRegistered() {
        Rating rating = ratingTestsUtils.findAnyRating();
        Long sessionId = rating.getSession().getId();
        String login = rating.getEmployee().getLogin();
        Employee employee = new Employee();
        employee.setLogin(login);
        ratingService.register(sessionId, employee);
        fail("should have failed at this point");
    }

    @Test
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void rate_shouldUpdate() {
        Rating rating = ratingTestsUtils.findAnyRatingForConnectedUser();
        Long sessionId = rating.getSession().getId();
        Integer initialSessionRatings = countRatingWithSessionId(sessionId);
        ratingTestsUtils.detach(rating);
        Integer updatedAnim = 2;
        rating.setAnimation(updatedAnim);
        ratingService.rate(rating);
        ratingTestsUtils.flush();
        String query = "SELECT * FROM " + TABLE_NAME + " WHERE id='" + rating.getId() + "'";
        Rating result = jdbcTemplate.queryForObject(query, (rs, rowNum) -> {
            Rating mapper = new Rating();
            mapper.setAnimation(rs.getInt("animation"));
            return mapper;
        });
        assertThat(result).isNotNull();
        assertThat(result.getAnimation()).isEqualTo(updatedAnim);
        assertThat(countRatingWithSessionId(sessionId)).isEqualTo(initialSessionRatings);
    }

    @Test(expected = ValidationException.class)
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void rate_shouldFailUserNotRegistered() {
        Rating rating = ratingTestsUtils.newRating();
        Session session = new Session();
        session.setId(sessionTestsUtils.findUnusedSession().getId());
        rating.setSession(session);
        ratingService.rate(rating);
        fail("should have failed at this point");
    }

    @Test(expected = ValidationException.class)
    @WithUserDetails(EmployeeServiceTests.EXISTING_LOGIN)
    public void rate_shouldFailCuzSameSessionAndEmployee() {
        Rating rating = ratingTestsUtils.newRating();
        Long employeeId = SecurityUtils.getCurrentUserOrThrow().getId();
        Long sessionId = ratingTestsUtils.findRatingsWithEmployeeId(employeeId).stream()
                .findAny()
                .map(r -> r.getSession().getId())
                .orElseThrow(() -> new IllegalStateException("no session corresponding with employee id " + employeeId));
        Session session = new Session();
        session.setId(sessionId);
        rating.setSession(session);
        ratingService.rate(rating);
        fail("should have failed at this point");
    }

    @Test(expected = ValidationException.class)
    @WithUserDetails(EmployeeServiceTests.UNUSED_LOGIN)
    public void rate_shouldFailCuzAttemptingToRateOtherUserSession() {
        Rating rating = ratingTestsUtils.findAnyRatingForUser(EmployeeServiceTests.EXISTING_LOGIN);
        ratingTestsUtils.detach(rating);
        ratingService.rate(rating);
        fail("should have failed at this point");
    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

    private Integer countRatingWithSessionId(Long sessionId) {
        String request = "SELECT COUNT(0) FROM " + TABLE_NAME + " WHERE session_id='" + sessionId + "'";
        return jdbcTemplate.queryForObject(request, Integer.class);
    }

}
