package com.github.jntakpe.mapper;

import com.github.jntakpe.config.ProfileConstants;
import com.github.jntakpe.config.properties.LdapProperties;
import com.github.jntakpe.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.stereotype.Component;

/**
 * Mapping d'un employee depuis le Ldap
 *
 * @author jntakpe
 */
//TODO renommer en service
@Component
@Profile(ProfileConstants.PROD)
public class LdapEmployeeMapper {

    private LdapProperties ldapProperties;

    @Autowired
    public LdapEmployeeMapper(LdapProperties ldapProperties) {
        this.ldapProperties = ldapProperties;
    }

    public Employee map(DirContextOperations ctx) {
        Employee employee = new Employee();
        employee.setLogin(ctx.getStringAttribute(ldapProperties.getAttributes().getLogin()));
        employee.setEmail(ctx.getStringAttribute(ldapProperties.getAttributes().getMail()));
        employee.setFirstName(ctx.getStringAttribute(ldapProperties.getAttributes().getFisrtName()));
        employee.setLastName(ctx.getStringAttribute(ldapProperties.getAttributes().getLastName()));
        employee.setDepartment(ctx.getStringAttribute(ldapProperties.getAttributes().getDepartment()));
        employee.setLocation(ctx.getStringAttribute(ldapProperties.getAttributes().getLocation()));
        employee.setPhone(ctx.getStringAttribute(ldapProperties.getAttributes().getPhone()));
        employee.setPassword("");
        return employee;
    }

}
