package com.github.jntakpe.service;

import com.github.jntakpe.repository.SessionRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Tests associés à la classe {@link SessionService}
 *
 * @author jntakpe
 */
public class SessionServiceTest extends AbstractTestsService {

    public static final String TABLE_NAME = "session";

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionRepository sessionRepository;

    @Test
    public void empty() {

    }

    @Override
    public String getTableName() {
        return TABLE_NAME;
    }
}
