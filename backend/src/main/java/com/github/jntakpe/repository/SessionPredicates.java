package com.github.jntakpe.repository;

import com.github.jntakpe.model.Location;
import com.github.jntakpe.model.QLocation;
import com.github.jntakpe.model.QSession;
import com.github.jntakpe.model.Session;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import org.apache.commons.lang3.StringUtils;

import java.util.Objects;

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
        if (session.getLocation() != null) {
            builder.and(withLocation(session.getLocation()));
        }
        return builder;
    }

    private static Predicate withLocation(Location location) {
        Objects.requireNonNull(location);
        QLocation qLocation = QSession.session.location;
        BooleanBuilder builder = new BooleanBuilder();
        if (StringUtils.isNotBlank(location.getName())) {
            builder.and(qLocation.name.startsWithIgnoreCase(location.getName()));
        }
        if (StringUtils.isNotBlank(location.getCity())) {
            builder.and(qLocation.city.startsWithIgnoreCase(location.getCity()));
        }
        return builder;
    }

}
