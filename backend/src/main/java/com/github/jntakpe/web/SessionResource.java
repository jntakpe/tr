package com.github.jntakpe.web;

import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.config.security.AuthoritiesConstants;
import com.github.jntakpe.dto.PageDTO;
import com.github.jntakpe.model.Session;
import com.github.jntakpe.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;

import static com.github.jntakpe.config.UriConstants.ID;

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

    @GetMapping
    public Page<Session> findAll(PageDTO page, Session session) {
        return sessionService.findWithPredicate(page.toPageRequest(), session);
    }

    @GetMapping(ID)
    public Session findById(@PathVariable Long id) {
        return sessionService.findByIdWithRelations(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public Session create(@RequestBody @Valid Session session) {
        return sessionService.save(session);
    }

    @PutMapping(ID)
    @RolesAllowed({AuthoritiesConstants.ADMIN, AuthoritiesConstants.TRAINER})
    public Session update(@PathVariable Long id, @RequestBody @Valid Session session) {
        session.setId(id);
        return sessionService.save(session);
    }

    @DeleteMapping(ID)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public void delete(@PathVariable Long id) {
        sessionService.delete(id);
    }

}
