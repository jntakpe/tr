package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Location;
import com.github.jntakpe.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
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

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(method = RequestMethod.POST)
    public Location create(@RequestBody Location location) {
        return locationService.save(location);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public Location update(@PathVariable Long id, @RequestBody @Valid Location location) {
        location.setId(id);
        return locationService.save(location);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable Long id) {
        locationService.delete(id);
    }

    @RequestMapping(value = "/{id}/constraints", method = RequestMethod.GET)
    public List<String> constraints(@PathVariable Long id) {
        return locationService.findConstraints(id);
    }

}
