package com.github.jntakpe.config.security;

/**
 * Constantes représentant les rôles Spring Security
 *
 * @author jntakpe
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String TRAINER = "ROLE_TRAINER";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    private AuthoritiesConstants() {
    }

}
