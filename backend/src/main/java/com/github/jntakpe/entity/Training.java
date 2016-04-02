package com.github.jntakpe.entity;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Bean représentant une formation
 *
 * @author jntakpe
 */
@Entity
public class Training extends AuditingEntity {

    @NotNull
    @Column(nullable = false, unique = true)
    private String name;

    @NotNull
    @Min(1)
    private Integer duration;

    @OneToMany(mappedBy = "training", cascade = CascadeType.REMOVE)
    private Set<Session> sessions = new HashSet<>();

    public Training() {
    }

    public Training(String name, Integer duration) {
        setName(name);
        this.duration = duration;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (Objects.nonNull(name)) {
            this.name = name.toLowerCase();
        }
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
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Training training = (Training) o;

        return name.equals(training.name);
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("name", name)
                .append("duration", duration)
                .toString();
    }

}
