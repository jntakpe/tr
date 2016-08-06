package com.github.jntakpe.config;

/**
 * Constantes liées aux URIs exposées par l'API
 *
 * @author jntakpe
 */
public final class UriConstants {

    public static final String API = "/api";

    public static final String TRAININGS = API + "/trainings";

    public static final String LOCATIONS = API + "/locations";

    public static final String SESSIONS = API + "/sessions";

    public static final String RATINGS = "/ratings";

    public static final String RATINGS_BY_SESSION = SESSIONS + "/{sessionId}" + RATINGS;

    private UriConstants() {
    }

}
