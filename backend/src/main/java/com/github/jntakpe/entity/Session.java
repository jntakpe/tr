package com.github.jntakpe.entity;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
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
    private LocalDate start;

    @ManyToOne(optional = false)
    private Location location;

    @ManyToOne(optional = false)
    private Training training;

    @ManyToOne(optional = false)
    private Collaborateur trainer;

    public Session() {
    }

    public Session(LocalDate start, Location location, Training training, Collaborateur trainer) {
        this.start = start;
        this.location = location;
        this.training = training;
        this.trainer = trainer;
    }

    public LocalDate getStart() {
        return start;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Training getTraining() {
        return training;
    }

    public void setTraining(Training training) {
        this.training = training;
    }

    public Collaborateur getTrainer() {
        return trainer;
    }

    public void setTrainer(Collaborateur trainer) {
        this.trainer = trainer;
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
        return Objects.equals(start, session.start) &&
                Objects.equals(location, session.location) &&
                Objects.equals(training, session.training) &&
                Objects.equals(trainer, session.trainer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(start, location, training, trainer);
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("start", start)
                .append("location", location)
                .append("training", training)
                .append("trainer", trainer)
                .toString();
    }
}
