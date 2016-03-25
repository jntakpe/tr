package com.github.jntakpe.entity;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Bean représentant une session de formation
 *
 * @author jntakpe
 */
@Entity
public class Session extends AuditingEntity {

    @NotNull
    @Column(nullable = false)
    private String location;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime start;

    @ManyToOne(optional = false)
    private Training training;

    public Session() {
    }

    public Session(String location, LocalDateTime start, Training training) {
        this.location = location;
        this.start = start;
        this.training = training;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public Training getTraining() {
        return training;
    }

    public void setTraining(Training training) {
        this.training = training;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Session)) {
            return false;
        }
        Session session = (Session) o;
        return Objects.equals(location, session.location) &&
                Objects.equals(start, session.start) &&
                Objects.equals(training, session.training);
    }

    @Override
    public int hashCode() {
        return Objects.hash(location, start, training);
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("location", location)
                .append("start", start)
                .append("training", training)
                .toString();
    }
}
