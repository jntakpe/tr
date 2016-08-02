package com.github.jntakpe.entity;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Entité représentant un lieu de formation
 *
 * @author jntakpe
 * @see AuditingEntity
 */
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"name", "city"})})
public class Location extends AuditingEntity {

    @NotNull
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    private String city;

    @OneToMany(mappedBy = "location")
    private Set<Session> sessions = new HashSet<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = Objects.nonNull(name) ? name.toLowerCase() : null;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Set<Session> getSessions() {
        return sessions;
    }

    public void setSessions(Set<Session> sessions) {
        this.sessions = sessions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Location)) {
            return false;
        }
        Location location = (Location) o;
        return Objects.equals(name, location.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("name", name)
                .toString();
    }
}
