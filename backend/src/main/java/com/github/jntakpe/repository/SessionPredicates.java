package com.github.jntakpe.repository;

import com.github.jntakpe.model.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import org.apache.commons.lang3.StringUtils;

import static com.github.jntakpe.model.QSession.session;

/**
 * Predicats permettant de filtrer les {@link Session}
 *
 * @author jntakpe
 */
public final class SessionPredicates {

    public static Predicate withSession(Session session) {
        BooleanBuilder builder = new BooleanBuilder();
        if (session == null) {
            return builder;
        }
        return builder
                .and(withLocation(session.getLocation()))
                .and(withTraining(session.getTraining()))
                .and(withTrainer(session.getTrainer()));
    }

    private static Predicate withLocation(Location location) {
        if (location == null) {
            return null;
        }
        QLocation qLocation = session.location;
        BooleanBuilder builder = new BooleanBuilder();
        if (StringUtils.isNotBlank(location.getName())) {
            builder.and(qLocation.name.startsWithIgnoreCase(location.getName()));
        }
        if (StringUtils.isNotBlank(location.getCity())) {
            builder.and(qLocation.city.startsWithIgnoreCase(location.getCity()));
        }
        return builder;
    }

    private static Predicate withTraining(Training training) {
        if (training == null) {
            return null;
        }
        QTraining qTraining = session.training;
        BooleanBuilder builder = new BooleanBuilder();
        if (StringUtils.isNotBlank(training.getName())) {
            builder.and(qTraining.name.startsWithIgnoreCase(training.getName()));
        }
        if (training.getDomain() != null) {
            builder.and(qTraining.domain.eq(training.getDomain()));
        }
        return builder;
    }

    private static Predicate withTrainer(Employee trainer) {
        if (trainer == null) {
            return null;
        }
        QEmployee qEmployee = session.trainer;
        BooleanBuilder builder = new BooleanBuilder();
        if (StringUtils.isNotBlank(trainer.getFirstName())) {
            builder.and(qEmployee.firstName.startsWithIgnoreCase(trainer.getFirstName()));
        }
        if (StringUtils.isNotBlank(trainer.getLastName())) {
            builder.and(qEmployee.lastName.startsWithIgnoreCase(trainer.getLastName()));
        }
        return builder;
    }

}
