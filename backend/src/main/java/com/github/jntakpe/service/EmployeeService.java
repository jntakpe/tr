package com.github.jntakpe.service;

import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Rating;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.repository.EmployeeRepository;
import com.github.jntakpe.repository.RatingRepository;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Services associés à l'entité {@link Employee}
 *
 * @author jntakpe
 */
@Service
public class EmployeeService {

    public static final String TRAINERS_CACHE = "trainers";

    private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeService.class);

    private final EmployeeRepository employeeRepository;

    private final RatingRepository ratingRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, RatingRepository ratingRepository) {
        this.employeeRepository = employeeRepository;
        this.ratingRepository = ratingRepository;
    }

    @Transactional(readOnly = true)
    public Optional<Employee> findByLogin(String login) {
        LOGGER.debug("Recherche de l'employé {}", login);
        return employeeRepository.findByLoginIgnoreCase(login);
    }

    @Transactional(readOnly = true)
    public List<Employee> findStartingByLogin(String login) {
        LOGGER.debug("Rechercher d'un l'employé commençant par {}", login);
        return employeeRepository.findByLoginStartingWithIgnoreCase(login);
    }

    @Transactional
    public Employee saveFromLdap(Employee employee) {
        LOGGER.info("Mise à jour de l'employé {} depuis le LDAP", employee.getLogin());
        employee.setLastLdapCheck(LocalDateTime.now());
        findByLogin(employee.getLogin()).ifPresent(e -> employee.setId(e.getId()));
        return employeeRepository.save(employee);
    }

    @Transactional(readOnly = true)
    public Employee findByIdWithAuthorities(Long id) {
        Employee employee = findById(id);
        Hibernate.initialize(employee.getAuthorities());
        return employee;
    }

    @Cacheable(TRAINERS_CACHE)
    @Transactional(readOnly = true)
    public List<Employee> findAllTrainers() {
        LOGGER.debug("Recherche de tous les formateurs");
        return employeeRepository.findAllTrainers();
    }

    //not tested
    @Transactional(readOnly = true)
    public List<Session> findSessionsByEmployeeId(Long employeeId) {
        LOGGER.debug("Recherche des sessions de l'employee {}", employeeId);
        return ratingRepository.findByEmployee_id(employeeId).stream()
                .map(Rating::getSession)
                .map(s -> s.setParticipantsCount(ratingRepository.countBySession_Id(s.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    private Employee findById(Long id) {
        Objects.requireNonNull(id);
        Employee employee = employeeRepository.findOne(id);
        if (employee == null) {
            LOGGER.warn("Aucun employée possédant l'id {}", id);
            throw new EntityNotFoundException(String.format("Aucun employée possédant l'id %s", id));
        }
        return employee;
    }

}
