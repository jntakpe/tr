package com.github.jntakpe.entity;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * Bean représentant une évaluation
 *
 * @author jntakpe
 */
@Entity
public class Rating extends GenericEntity {

    private Short subject;

    private Short theory;

    private Short pratice;

    private Short animation;

    private Short documentation;

    private Short exercices;

    private String cons;

    private String pros;

    private String suggests;

    @ManyToOne
    private User user;

    public Short getSubject() {
        return subject;
    }

    public void setSubject(Short subject) {
        this.subject = subject;
    }

    public Short getTheory() {
        return theory;
    }

    public void setTheory(Short theory) {
        this.theory = theory;
    }

    public Short getPratice() {
        return pratice;
    }

    public void setPratice(Short pratice) {
        this.pratice = pratice;
    }

    public Short getAnimation() {
        return animation;
    }

    public void setAnimation(Short animation) {
        this.animation = animation;
    }

    public Short getDocumentation() {
        return documentation;
    }

    public void setDocumentation(Short documentation) {
        this.documentation = documentation;
    }

    public Short getExercices() {
        return exercices;
    }

    public void setExercices(Short exercices) {
        this.exercices = exercices;
    }

    public String getCons() {
        return cons;
    }

    public void setCons(String cons) {
        this.cons = cons;
    }

    public String getPros() {
        return pros;
    }

    public void setPros(String pros) {
        this.pros = pros;
    }

    public String getSuggests() {
        return suggests;
    }

    public void setSuggests(String suggests) {
        this.suggests = suggests;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("subject", subject)
                .append("theory", theory)
                .append("pratice", pratice)
                .append("animation", animation)
                .append("documentation", documentation)
                .append("exercices", exercices)
                .append("user", user)
                .toString();
    }
}
