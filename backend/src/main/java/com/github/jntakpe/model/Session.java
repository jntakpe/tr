package com.github.jntakpe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Bean représentant une session de formation
 *
 * @author jntakpe
 * @see AuditingEntity
 */
@Entity
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"start", "location_id", "training_id", "trainer_id"})})
@NamedEntityGraph(name = "Session.detail",
        attributeNodes = {@NamedAttributeNode("training"), @NamedAttributeNode("trainer"), @NamedAttributeNode("location")})
public class Session extends AuditingEntity {

    @NotNull
    @Column(nullable = false)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate start;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Location location;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Training training;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Employee trainer;

    @JsonIgnore
    @OneToMany(mappedBy = "session")
    private Set<Rating> ratings = new HashSet<>();

    public String toStringConstraint() {
        return "du " + getStart() + " de " + getTrainer().getFullName();
    }

    public LocalDate getStart() {
        return start;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public Employee getTrainer() {
        return trainer;
    }

    public void setTrainer(Employee trainer) {
        this.trainer = trainer;
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

    public Set<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        this.ratings = ratings;
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
