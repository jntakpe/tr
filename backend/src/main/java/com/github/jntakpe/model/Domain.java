package com.github.jntakpe.model;


import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Énumération des domaines de formation
 *
 * @author jntakpe
 */
public enum Domain {

    @JsonProperty("Fondamentaux groupe")
    FONDAMENDAUX_GROUPE,

    @JsonProperty("Management")
    MANAGEMENT,

    @JsonProperty("Stratégie et offres")
    STRATEGIE_OFFRES,

    @JsonProperty("Commerce")
    COMMERCE,

    @JsonProperty("Comportement")
    COMPORTEMENT,

    @JsonProperty("Méthode, qualité et sécurité")
    METHODE_QUALITE_SECURITE,

    @JsonProperty("Métiers et secteurs")
    METIERS_SECTEURS,

    @JsonProperty("Technologies")
    TECHNOLOGIES,

    @JsonProperty("Solutions")
    SOLUTIONS,

    @JsonProperty("Langues et bureautique")
    LANGUES_BUREAUTIQUE

}
