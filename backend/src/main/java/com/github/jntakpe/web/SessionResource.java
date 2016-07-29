package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Session;
import com.github.jntakpe.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Publication de la ressource {@link Session}
 *
 * @author jntakpe
 */
@RestController
@RequestMapping(UriConstants.SESSIONS)
public class SessionResource {

    private final SessionService sessionService;

    @Autowired
    public SessionResource(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Session> findAll() {
        return sessionService.findAll();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(method = RequestMethod.POST)
    public Session create(@RequestBody @Valid Session session) {
        return sessionService.save(session);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public Session update(@PathVariable Long id, @RequestBody @Valid Session session) {
        return sessionService.save(session);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable Long id) {
        sessionService.delete(id);
    }

}
