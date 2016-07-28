package com.github.jntakpe.entity;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Bean représentant une session de formation
 *
 * @author jntakpe
 */
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(
        columnNames = {"start", "location_id", "training_id", "trainer_id"}
)})
public class Session extends AuditingEntity {

    @NotNull
    @Column(nullable = false)
    private LocalDate start;

    @Valid
    @ManyToOne(optional = false)
    private Location location;

    @Valid
    @ManyToOne(optional = false)
    private Training training;

    @Valid
    @ManyToOne(optional = false)
    private Employee trainer;

    public Session() {
    }

    public Session(LocalDate start, Location location, Training training, Employee trainer) {
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

    public Employee getTrainer() {
        return trainer;
    }

    public void setTrainer(Employee trainer) {
        this.trainer = trainer;
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
