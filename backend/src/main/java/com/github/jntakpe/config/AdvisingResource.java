package com.github.jntakpe.config;

import com.github.jntakpe.model.Domain;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;

import javax.persistence.EntityNotFoundException;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceException;
import javax.validation.ValidationException;
import java.beans.PropertyEditorSupport;

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

    @InitBinder
    public void initBinder(WebDataBinder webDataBinder) {
        webDataBinder.registerCustomEditor(Domain.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                setValue(Domain.fromLibelle(text));
            }
        });
    }
}
