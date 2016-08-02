package com.github.jntakpe.mapper;

import com.github.jntakpe.config.properties.LdapProperties;
import com.github.jntakpe.model.Person;
import org.springframework.ldap.core.DirContextOperations;

/**
 * Mapper transformation le contexte LDAP {@link DirContextOperations} en {@link Person}
 *
 * @author jntakpe
 */
public class LdapCtxPersonMapper {

    private final LdapProperties.Attributes attributes;

    public LdapCtxPersonMapper(LdapProperties ldapProperties) {
        this.attributes = ldapProperties.getAttributes();
    }

    public Person map(DirContextOperations input) {
        Person person = new Person();
        person.setLogin(input.getStringAttribute(attributes.getLogin()));
        person.setEmail(input.getStringAttribute(attributes.getEmail()));
        person.setFirstName(input.getStringAttribute(attributes.getFisrtName()));
        person.setLastName(input.getStringAttribute(attributes.getLastName()));
        person.setDepartment(input.getStringAttribute(attributes.getDepartment()));
        person.setLocation(input.getStringAttribute(attributes.getLocation()));
        person.setPhone(input.getStringAttribute(attributes.getPhone()));
        return person;
    }
}
