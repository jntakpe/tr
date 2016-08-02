package com.github.jntakpe.service;

import com.github.jntakpe.config.ProfileConstants;
import com.github.jntakpe.config.properties.LdapProperties;
import com.github.jntakpe.mapper.LdapCtxPersonMapper;
import com.github.jntakpe.mapper.PersonEmployeeMapper;
import com.github.jntakpe.model.Employee;
import com.github.jntakpe.model.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.terracotta.modules.ehcache.store.TerracottaClusteredInstanceFactory.LOGGER;

/**
 * Services associés à l'entité {@link Person} récupérée depuis le LDAP
 *
 * @author jntakpe
 */
@Service
@Profile(ProfileConstants.PROD)
public class PersonService {

    private final EmployeeService employeeService;

    private final LdapCtxPersonMapper ldapCtxPersonMapper;

    private final PersonEmployeeMapper personEmployeeMapper;

    @Autowired
    public PersonService(EmployeeService employeeService, LdapProperties ldapProperties, PasswordEncoder passwordEncoder) {
        this.employeeService = employeeService;
        this.ldapCtxPersonMapper = new LdapCtxPersonMapper(ldapProperties);
        this.personEmployeeMapper = new PersonEmployeeMapper(passwordEncoder);
    }

    @Transactional
    public Employee save(DirContextOperations ctx, String pwd) {
        Person person = ldapCtxPersonMapper.map(ctx);
        Optional<Employee> opt = employeeService.findByLogin(person.getLogin());
        LOGGER.info("{} de l'employé {} à partir du LDAP", opt.isPresent() ? "Mise à jour" : "Création", person.getLogin());
        Employee employee = opt.isPresent() ? personEmployeeMapper.map(person, opt.get(), pwd) : personEmployeeMapper.map(person, pwd);
        return employeeService.saveFromLdap(employee);
    }

}
