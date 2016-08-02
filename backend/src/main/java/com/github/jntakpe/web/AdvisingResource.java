package com.github.jntakpe.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.persistence.EntityNotFoundException;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceException;
import javax.validation.ValidationException;

/**
 * Ressource gérant les aspects transverses des contrôleurs / ressources
 *
 * @author jntakpe
 */
@ControllerAdvice
public class AdvisingResource {

    @ExceptionHandler({NoResultException.class, EntityNotFoundException.class})
    public ResponseEntity<String> handleNotFound(PersistenceException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<String> handleValidation(ValidationException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
