package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Location;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Publication de la ressource {@link Location}
 *
 * @author jntakpe
 */
@RestController
@RequestMapping(UriConstants.LOCATIONS)
public class LocationResource {

}
