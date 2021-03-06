import {Component, OnDestroy, ViewChild} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import '../../../shared/rxjs.extension';
import {FormService} from '../../../shared/form/form.service';
import {FormField} from '../../../shared/form/form-field';
import {TrainingService} from '../training.service';
import {Training} from '../training';
import {Input} from '@angular/core/src/metadata/directives';

@Component({
  selector: 'tr-save-training-modal',
  templateUrl: './save-training-modal.component.html'
})
export class SaveTrainingModalComponent implements OnDestroy {

  @Input() domains: Observable<string[]>;

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

  ngOnDestroy() {
    if (this.saveFormSubscription) {
      this.saveFormSubscription.unsubscribe();
    }
  }

  private initForm(training?: Training) {
    this.formErrors = {};
    this.creation = !training;
    return this.formService.buildValidationForm({
      name: new FormField([training ? training.name : null, Validators.required], {
        required: 'Le nom de la formation est requis'
      }),
      domain: new FormField([training ? training.domain : '', Validators.required], {
        required: 'Le domaine de la formation est requis'
      }),
      duration: new FormField([training ? training.duration : null, Validators.required], {
        required: 'La durée de la formation est requise'
      })
    });
  }

}
