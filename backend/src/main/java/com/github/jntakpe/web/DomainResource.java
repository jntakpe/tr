package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.model.Domain;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Publication de la ressource {@link Domain}
 *
 * @author jntakpe
 */
@RestController
@RequestMapping(UriConstants.DOMAINS)
public class DomainResource {

    @RequestMapping(method = RequestMethod.GET)
    public List<Domain> findAll() {
        return Arrays.stream(Domain.values()).collect(Collectors.toList());
    }
}
