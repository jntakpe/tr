package com.github.jntakpe.model;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.*;
import java.util.Objects;

/**
 * Bean représentant une évaluation d'une session de formation. Il est possible qu'une évaluation soit vide par exemple dans le cas d'une
 * inscription à une session de formation non réalisée.
 *
 * @author jntakpe
 * @see AuditingEntity
 */
@Entity
@NamedEntityGraph(name = "Rating.session", attributeNodes = {@NamedAttributeNode(value = "session", subgraph = "Rating.Session.detail"),},
        subgraphs = {@NamedSubgraph(name = "Rating.Session.detail",
                attributeNodes = {@NamedAttributeNode("training"), @NamedAttributeNode("trainer"), @NamedAttributeNode("location")})})
public class Rating extends AuditingEntity {

    private Integer subject;

    private Integer theory;

    private Integer pratice;

    private Integer animation;

    private Integer documentation;

    private Integer exercices;

    private String cons;

    private String pros;

    private String suggests;

    private boolean anonymous;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Session session;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Employee employee;

    public Rating() {
    }

    public Rating(Session session, Employee employee) {
        this.session = session;
        this.employee = employee;
    }

    public Integer getSubject() {
        return subject;
    }

    public void setSubject(Integer subject) {
        this.subject = subject;
    }

    public Integer getTheory() {
        return theory;
    }

    public void setTheory(Integer theory) {
        this.theory = theory;
    }

    public Integer getPratice() {
        return pratice;
    }

    public void setPratice(Integer pratice) {
        this.pratice = pratice;
    }

    public Integer getAnimation() {
        return animation;
    }

    public void setAnimation(Integer animation) {
        this.animation = animation;
    }

    public Integer getDocumentation() {
        return documentation;
    }

    public void setDocumentation(Integer documentation) {
        this.documentation = documentation;
    }

    public Integer getExercices() {
        return exercices;
    }

    public void setExercices(Integer exercices) {
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

    public boolean isAnonymous() {
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rating)) {
            return false;
        }
        Rating rating = (Rating) o;
        return Objects.equals(session, rating.session) &&
                Objects.equals(employee, rating.employee);
    }

    @Override
    public int hashCode() {
        return Objects.hash(session, employee);
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
                .append("employeeId", employee.getId())
                .append("sessionId", session.getId())
                .toString();
    }
}
