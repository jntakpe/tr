import {Component, OnDestroy, OnInit} from '@angular/core';
import {SessionService} from '../session.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../../../shared/form/form.service';
import {Subscription} from 'rxjs/Subscription';
import {Session} from '../../../session/session';
import {FormField} from '../../../shared/form/form-field';
import {FormMessages} from '../../../shared/form/form-messages';
import {SelectEntry} from '../../../shared/select-entry';
import {TrainerService} from '../../trainer/trainer.service';
import {LocationService} from '../../location/location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TrainingService} from '../../training/training.service';
import '../../../shared/rxjs.extension';

@Component({
  selector: 'tr-session-edit-component',
  templateUrl: './session-edit.component.html',
  styleUrls: ['./session-edit.component.scss']
})
export class SessionEditComponent implements OnInit, OnDestroy {

  trainings: SelectEntry[] = [];

  trainingsSubscription: Subscription;

  locations: SelectEntry[] = [];

  locationsSubscription: Subscription;

  trainers: SelectEntry[] = [];

  trainersSubscription: Subscription;

  session: Session;

  sessionForm: FormGroup;

  formErrors: { [key: string]: string } = {};

  creation: boolean;

  employees: FormArray;

  constructor(private sessionService: SessionService,
              private trainerService: TrainerService,
              private locationService: LocationService,
              private trainingService: TrainingService,
              private formService: FormService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.locationsSubscription = this.locationService.findAllLocations().subscribe(locations => {
      this.locations = locations;
      this.initSelectize('location');
    });
    this.trainersSubscription = this.trainerService.findAllTrainers().subscribe(trainers => {
      this.trainers = trainers;
      this.initSelectize('trainer');
    });
    this.trainingsSubscription = this.trainingService.findAllTrainings().subscribe(trainings => {
      this.trainings = trainings;
      this.initSelectize('training');
    });
    this.route.params.mergeMap(p => this.sessionService.findSession(p['id'])).subscribe(s => {
      this.session = s;
      const formMessages = this.initForm();
      this.sessionForm = formMessages.formGroup;
      this.sessionForm.valueChanges.subscribe(formData => this.formErrors = this.formService.validate(formData, formMessages));
    });
  }

  ngOnDestroy() {
    if (this.trainingsSubscription) {
      this.trainingsSubscription.unsubscribe();
    }
    if (this.locationsSubscription) {
      this.locationsSubscription.unsubscribe();
    }
    if (this.trainersSubscription) {
      this.trainersSubscription.unsubscribe();
    }
  }

  addTrainee(): void {
    this.employees.push(this.formBuilder.control(''));
  }

  removeTrainee(index: number): void {
    this.employees.removeAt(index);
  }

  save(sessionForm: FormGroup) {
    this.sessionService.save(sessionForm.value).subscribe(() => this.router.navigate(['/admin/sessions']));
  }

  private initForm(): FormMessages {
    this.formErrors = {};
    this.creation = !this.session;
    this.employees = this.initTraineeForm();
    const formMessages = this.formService.buildValidationForm({
      start: new FormField([this.session ? this.session.start : null, Validators.required], {
        required: 'La saisie de la date de début de la session est obligatoire'
      }),
      location: new FormField([this.session && this.session.location ? this.session.location.id : null, Validators.required], {
        required: 'La saisie du site de formation est obligatoire'
      }),
      trainer: new FormField([this.session && this.session.trainer ? this.session.trainer.id : null, Validators.required], {
        required: 'La saisie du formateur est obligatoire'
      }),
      training: new FormField([this.session && this.session.training ? this.session.training.id : null, Validators.required], {
        required: 'La saisie de la formation est obligatoire'
      })
    });
    formMessages.formGroup.addControl('employees', this.employees);
    return formMessages;
  }

  private initTraineeForm(): FormArray {
    const formArray: FormArray = this.formBuilder.array([]);
    if (this.session && this.session.employees) {
      this.session.employees.forEach(e => formArray.push(this.formBuilder.control(e)));
    }
    return formArray;
  }

  private initSelectize(field: string): void {
    setTimeout(() => $(`#${field}`).selectize({
      create: true,
      diacritics: true,
      sortField: 'text',
      onChange: value => {
        this.sessionForm.controls[field].markAsDirty();
        this.sessionForm.patchValue({[field]: value});
      }
    }), 100);
  }

}
