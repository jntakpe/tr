package com.github.jntakpe.model;


import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

/**
 * Énumération des domaines de formation
 *
 * @author jntakpe
 */
public enum Domain {

    FONDAMENDAUX_GROUPE("Fondamentaux groupe"),

    MANAGEMENT("Management"),

    STRATEGIE_OFFRES("Stratégie et offres"),

    COMMERCE("Commerce"),

    COMPORTEMENT("Comportement"),

    METHODE_QUALITE_SECURITE("Méthode, qualité et sécurité"),

    METIERS_SECTEURS("Métiers et secteurs"),

    TECHNOLOGIES("Technologies"),

    SOLUTIONS("Solutions"),

    LANGUES_BUREAUTIQUE("Langues et bureautique");

    private final String libelle;

    Domain(String libelle) {
        this.libelle = libelle;
    }

    public static Domain fromLibelle(String libelle) {
        return Arrays.stream(Domain.values())
                .filter(d -> d.getLibelle().equals(libelle))
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No domain value for libelle : " + libelle));
    }

    @JsonValue
    public String getLibelle() {
        return libelle;
    }

}
