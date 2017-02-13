package com.github.jntakpe.web;

import com.github.jntakpe.config.security.AuthoritiesConstants;
import com.github.jntakpe.model.Location;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.service.LocationService;
import com.github.jntakpe.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import java.util.List;

import static com.github.jntakpe.config.UriConstants.ID;
import static com.github.jntakpe.config.UriConstants.LOCATIONS;

/**
 * Publication de la ressource {@link Location}
 *
 * @author jntakpe
 */
@RestController
@RequestMapping(LOCATIONS)
public class LocationResource {

    private final LocationService locationService;

    private final SessionService sessionService;

    @Autowired
    public LocationResource(LocationService locationService, SessionService sessionService) {
        this.locationService = locationService;
        this.sessionService = sessionService;
    }

    @GetMapping
    public List<Location> findAll() {
        return locationService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public Location create(@RequestBody Location location) {
        return locationService.save(location);
    }

    @PutMapping(ID)
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public Location update(@PathVariable Long id, @RequestBody @Valid Location location) {
        location.setId(id);
        return locationService.save(location);
    }

    @DeleteMapping(ID)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public void delete(@PathVariable Long id) {
        locationService.delete(id);
    }

    @GetMapping(ID + "/constraints")
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public ResponseEntity<List<String>> constraints(@PathVariable Long id) {
        List<String> constraints = locationService.findConstraints(id);
        return constraints.isEmpty() ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(constraints, HttpStatus.OK);
    }

    @GetMapping(ID + "/sessions")
    //@RolesAllowed(AuthoritiesConstants.ADMIN)
    public List<Session> findSessions(@PathVariable Long id) {
        return sessionService.findByLocationId(id);
    }
}
