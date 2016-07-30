package com.github.jntakpe.web;

import com.github.jntakpe.service.RatingService;
import org.mockito.Mock;

/**
 * Tests associés à la ressource REST {@link RatingResource}
 *
 * @author jntakpe
 */
public class RatingResourceTests extends AbstractResourceTests {

    @Mock
    private RatingService mockRatingService;

    @Override
    public Object getMockResource() {
        return new RatingResource(mockRatingService);
    }

}
