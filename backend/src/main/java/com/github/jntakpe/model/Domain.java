package com.github.jntakpe.model;

/**
 * Énumération des domaines de formation
 *
 * @author jntakpe
 */
public enum Domain {

    FONDAMENDAUX_GROUPE("Fondamendaux groupe"),
    MANAGEMENT("Management"),
    STRATEGIE_OFFRES("Stratégie et offres"),
    COMMERCE("Commerce"),
    COMPORTEMENT("Comportement"),
    METHODE_QUALITE_SECURITE("Méthode, qualité et sécurité"),
    METIERS_SECTEURS("Métiers et secteurs"),
    TECHNOLOGIES("Technologies"),
    SOLUTIONS("Solutions"),
    LANGUES_BUREAUTIQUE("Langues et bureautique");

    private final String label;

    Domain(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
