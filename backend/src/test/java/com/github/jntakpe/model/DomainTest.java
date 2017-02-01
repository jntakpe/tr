package com.github.jntakpe.model;

import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Fail.fail;


/**
 * Tests associés au bean {@link Domain}
 *
 * @author jntakpe
 */
public class DomainTest {

    @Test
    public void fromLibelle_shouldFindEnum() {
        assertThat(Domain.fromLibelle("Stratégie et offres")).isEqualTo(Domain.STRATEGIE_OFFRES);
    }

    @Test(expected = IllegalStateException.class)
    public void fromLibelle_shouldNotFind() {
        Domain.fromLibelle("Stratégie et offre");
        fail("should have failed at this point");
    }

}