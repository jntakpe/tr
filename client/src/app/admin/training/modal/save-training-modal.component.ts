import {Component, ViewChild} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {Subscription, Observable} from 'rxjs';
import {FormService} from '../../../shared/form/form.service';
import {FormField} from '../../../shared/form/form-field';
import {TrainingService} from '../training.service';
import {Training} from '../training';

@Component({
  selector: 'save-training-modal',
  template: require('./save-training-modal.component.html')
})
export class SaveTrainingModalComponent {

  @ViewChild('editContentModal') editContentModal;

  saveForm: FormGroup;

  formErrors: {[key: string]: string} = {};

  saveFormSubscription: Subscription;

  creation: boolean;

  constructor(private trainingService: TrainingService, private formService: FormService) {
  }

  save(training?: Training): Observable<Training[]> {
    const formMessages = this.initForm(training);
    this.saveForm = formMessages.formGroup;
    this.saveFormSubscription = this.saveForm.valueChanges
      .subscribe(formData => this.formErrors = this.formService.validate(formData, formMessages));
    return this.trainingService.saveModal(this.editContentModal, training);
  }

  private initForm(training?: Training) {
    this.formErrors = {};
    this.creation = !training;
    return this.formService.buildValidationForm({
      name: new FormField([training ? training.name : null, Validators.required], {
        required: 'Le nom de la formation est requis'
      }),
      domain: new FormField([training ? training.domain : null, Validators.required], {
        required: 'Le domaine de la formation est requis'
      }),
      duration: new FormField([training ? training.duration : null, Validators.required], {
        required: 'La durée de la formation est requise'
      })
    });
  }

}
