package com.github.jntakpe.utils;

import com.github.jntakpe.entity.Employee;
import com.github.jntakpe.entity.Location;
import com.github.jntakpe.entity.Session;
import com.github.jntakpe.entity.Training;
import com.github.jntakpe.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link Session}
 *
 * @author jntakpe
 */
@Component
public class SessionTestsUtils {

    private final LocationTestsUtils locationTestsUtils;

    private final TrainingTestsUtils trainingTestsUtils;

    private final EmployeeTestUtils employeeTestUtils;

    private final SessionRepository sessionRepository;

    @Autowired
    public SessionTestsUtils(LocationTestsUtils locationTestsUtils,
                             TrainingTestsUtils trainingTestsUtils,
                             EmployeeTestUtils employeeTestUtils,
                             SessionRepository sessionRepository) {
        this.locationTestsUtils = locationTestsUtils;
        this.trainingTestsUtils = trainingTestsUtils;
        this.employeeTestUtils = employeeTestUtils;
        this.sessionRepository = sessionRepository;
    }

    public Session findAnySession() {
        return sessionRepository.findAll().stream()
                .findAny()
                .orElseThrow(() -> new IllegalStateException("No session"));
    }

    public void flush() {
        sessionRepository.flush();
    }

    public Session getSessionWithDetachedRelations(LocalDate startDate) {
        Training training = trainingTestsUtils.findDefaultTraining();
        Location location = locationTestsUtils.findDefaultLocation();
        Employee employee = employeeTestUtils.findDefaultEmployee();
        Training detachedTraining = new Training();
        detachedTraining.setId(training.getId());
        detachedTraining.setName(training.getName());
        detachedTraining.setDuration(training.getDuration());
        Location detachedLocation = new Location();
        detachedLocation.setId(location.getId());
        detachedLocation.setName(location.getName());
        Employee detachedEmployee = new Employee();
        detachedEmployee.setId(employee.getId());
        detachedEmployee.setLogin(employee.getLogin());
        detachedEmployee.setEmail(employee.getEmail());
        return new Session(startDate, detachedLocation, detachedTraining, detachedEmployee);
    }

    public Session getSessionWithAttachedRelations(LocalDate startDate) {
        Training training = trainingTestsUtils.findDefaultTraining();
        Location location = locationTestsUtils.findDefaultLocation();
        Employee employee = employeeTestUtils.findDefaultEmployee();
        return new Session(startDate, location, training, employee);
    }

}
