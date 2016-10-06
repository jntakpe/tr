import {Component, OnInit, OnDestroy} from '@angular/core';
import {SessionService} from '../session.service';
import {FormGroup, Validators} from '@angular/forms';
import {FormService} from '../../../shared/form/form.service';
import {Subscription} from 'rxjs';
import {Session} from '../../../session/session';
import {FormField} from '../../../shared/form/form-field';
import {FormMessages} from '../../../shared/form/form-messages';
import {SelectEntry} from '../../../shared/select-entry';

@Component({
  selector: 'session-edit-component',
  template: require('./session-edit.component.html')
})
export class SessionEditComponent implements OnInit, OnDestroy {

  trainings: SelectEntry[] = [];

  trainingsSubscription: Subscription;

  session: Session;

  sessionForm: FormGroup;

  sessionFormSubscription: Subscription;

  formErrors: {[key: string]: string} = {};

  creation: boolean;

  constructor(private sessionService: SessionService, private formService: FormService) {
  }

  ngOnInit() {
    const formMessages = this.initForm();
    this.sessionForm = formMessages.formGroup;
    this.trainingsSubscription = this.sessionService.findAllTrainings().subscribe(trainings => this.trainings = trainings);
  }

  ngOnDestroy() {
    this.trainingsSubscription.unsubscribe();
  }

  private initForm(): FormMessages {
    this.formErrors = {};
    this.creation = !this.session;
    return this.formService.buildValidationForm({
      start: new FormField([this.session ? this.session.start : null, Validators.required], {
        required: 'La saisie de la date début de la session est obligatoire'
      }),
      location: new FormField([this.session ? this.session.location && this.session.location.id : null, Validators.required], {
        required: 'La saisie du site de formation est obligatoire'
      }),
      trainer: new FormField([this.session ? this.session.trainer && this.session.trainer.id : null, Validators.required], {
        required: 'La saisie du formateur est obligatoire'
      }),
      training: new FormField([this.session ? this.session.training && this.session.training.id : null, Validators.required], {
        required: 'La saisie de la formation est obligatoire'
      })
    });
  }
}
