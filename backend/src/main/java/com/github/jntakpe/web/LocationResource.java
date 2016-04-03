package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Location;
import com.github.jntakpe.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Publication de la ressource {@link Location}
 *
 * @author jntakpe
 */
@RestController
@RequestMapping(UriConstants.LOCATIONS)
public class LocationResource {

    private LocationService locationService;

    @Autowired
    public LocationResource(LocationService locationService) {
        this.locationService = locationService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Location> findAll() {
        return locationService.findAll();
    }
}
