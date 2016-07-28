package com.github.jntakpe.utils;

import com.github.jntakpe.entity.Employee;
import com.github.jntakpe.entity.Location;
import com.github.jntakpe.entity.Session;
import com.github.jntakpe.entity.Training;
import com.github.jntakpe.repository.EmployeeRepository;
import com.github.jntakpe.repository.LocationRepository;
import com.github.jntakpe.repository.TrainingRepository;
import com.github.jntakpe.service.CollaborateurServiceTests;
import com.github.jntakpe.service.LocationServiceTests;
import com.github.jntakpe.service.TrainingServiceTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Méthodes utilitaires pour les tests de l'entité {@link com.github.jntakpe.entity.Session}
 *
 * @author jntakpe
 */
@Component
public class SessionTestsUtils {

    private LocationRepository locationRepository;

    private TrainingRepository trainingRepository;

    private EmployeeRepository employeeRepository;

    @Autowired
    public SessionTestsUtils(LocationRepository locationRepository, TrainingRepository trainingRepository, EmployeeRepository employeeRepository) {
        this.locationRepository = locationRepository;
        this.trainingRepository = trainingRepository;
        this.employeeRepository = employeeRepository;
    }

    public Session getSessionWithDetachedRelations(LocalDate startDate) {
        Training training = trainingRepository.findByNameIgnoreCase(TrainingServiceTest.EXISTING_NAME)
                .orElseThrow(() -> new IllegalStateException("No training"));
        Location location = locationRepository.findByNameIgnoreCase(LocationServiceTests.EXISTING_NAME)
                .orElseThrow(() -> new IllegalStateException("No location"));
        Employee employee = employeeRepository.findByLoginIgnoreCase(CollaborateurServiceTests.EXISTING_LOGIN)
                .orElseThrow(() -> new IllegalStateException("No collab"));
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
        Training training = trainingRepository.findByNameIgnoreCase(TrainingServiceTest.EXISTING_NAME)
                .orElseThrow(() -> new IllegalStateException("No training"));
        Location location = locationRepository.findByNameIgnoreCase(LocationServiceTests.EXISTING_NAME)
                .orElseThrow(() -> new IllegalStateException("No location"));
        Employee employee = employeeRepository.findByLoginIgnoreCase(CollaborateurServiceTests.EXISTING_LOGIN)
                .orElseThrow(() -> new IllegalStateException("No collab"));
        return new Session(startDate, location, training, employee);
    }

}
