package com.github.jntakpe.entity;

import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * Bean représentant une évaluation
 *
 * @author jntakpe
 * @see AuditingEntity
 */
@Entity
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

    @ManyToOne(optional = false)
    private Session session;

    @ManyToOne(optional = false)
    private Employee employee;

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
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Rating rating = (Rating) o;

        if (!session.equals(rating.session)) {
            return false;
        }
        return employee.equals(rating.employee);

    }

    @Override
    public int hashCode() {
        int result = session.hashCode();
        result = 31 * result + employee.hashCode();
        return result;
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
