package com.github.jntakpe.service;

import com.github.jntakpe.entity.Rating;
import com.github.jntakpe.utils.RatingTestsUtils;
import org.springframework.beans.factory.annotation.Autowired;

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

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }

}
