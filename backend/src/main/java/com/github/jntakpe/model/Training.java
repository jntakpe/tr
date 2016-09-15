package com.github.jntakpe.model;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Bean représentant une formation
 *
 * @author jntakpe
 * @see AuditingEntity
 */
@Entity
public class Training extends AuditingEntity {

    @NotNull
    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    private Domain domain;

    @Min(1)
    @NotNull
    private Integer duration;

    @OneToMany(mappedBy = "training")
    private Set<Session> sessions = new HashSet<>();

    public String getDomainLabel() {
        return domain.getLabel();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = Objects.nonNull(name) ? name.toLowerCase() : null;
    }

    public Domain getDomain() {
        return domain;
    }

    public void setDomain(Domain domain) {
        this.domain = domain;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Set<Session> getSessions() {
        return sessions;
    }

    public void setSessions(Set<Session> sessions) {
        this.sessions = sessions;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, domain);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Training)) {
            return false;
        }
        Training training = (Training) o;
        return Objects.equals(name, training.name) &&
                domain == training.domain;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("name", name)
                .append("domain", domain)
                .append("duration", duration)
                .toString();
    }

}
