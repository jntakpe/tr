package com.github.jntakpe.entity;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Entité représentant un collaborateur de Sopra Steria
 *
 * @author jntakpe
 */
@Entity
public class Collaborateur extends AuditingEntity {

    @NotNull
    @Column(unique = true, nullable = false)
    private String login;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Collaborateur collaborateur = (Collaborateur) o;

        return login.equals(collaborateur.login);
    }

    @Override
    public int hashCode() {
        return login.hashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("login", login)
                .toString();
    }
}
