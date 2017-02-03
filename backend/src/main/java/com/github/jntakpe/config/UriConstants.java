package com.github.jntakpe.config;

/**
 * Constantes liées aux URIs exposées par l'API
 *
 * @author jntakpe
 */
public final class UriConstants {

    public static final String ID = "/{id}";

    public static final String API = "/api";

    public static final String TRAININGS = API + "/trainings";

    public static final String LOCATIONS = API + "/locations";

    public static final String SESSIONS = API + "/sessions";

    public static final String RATINGS = API + "/ratings";

    public static final String RATINGS_BY_SESSION = SESSIONS + "/{sessionId}" + RATINGS;

    public static final String DOMAINS = API + "/domains";

    public static final String TRAINERS = API + "/trainers";

    private UriConstants() {
    }

}
