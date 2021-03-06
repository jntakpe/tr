import {Component, OnDestroy, ViewChild} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import '../../../shared/rxjs.extension';
import {FormService} from '../../../shared/form/form.service';
import {LocationService} from '../location.service';
import {Location} from '../location';
import {FormField} from '../../../shared/form/form-field';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'tr-save-location-modal',
  templateUrl: './save-location-modal.component.html'
})
export class SaveLocationModalComponent implements OnDestroy {

  @ViewChild('editContentModal') editContentModal;

  saveForm: FormGroup;

  formErrors: {[key: string]: string} = {};

  saveFormSubscription: Subscription;

  creation: boolean;

  constructor(private locationService: LocationService, private formService: FormService) {
  }

  save(location?: Location): Observable<Location[]> {
    const formMessages = this.initForm(location);
    this.saveForm = formMessages.formGroup;
    this.saveFormSubscription = this.saveForm.valueChanges
      .subscribe(formData => this.formErrors = this.formService.validate(formData, formMessages));
    return this.locationService.saveModal(this.editContentModal, location);
  }

  ngOnDestroy() {
    if (this.saveFormSubscription) {
      this.saveFormSubscription.unsubscribe();
    }
  }

  private initForm(location?: Location) {
    this.formErrors = {};
    this.creation = !location;
    return this.formService.buildValidationForm({
      name: new FormField([location ? location.name : null, Validators.required], {
        required: 'Le nom du site de formation est requis'
      }),
      city: new FormField([location ? location.city : null, Validators.required], {
        required: 'La ville du site de formation est requise'
      })
    });
  }

}
