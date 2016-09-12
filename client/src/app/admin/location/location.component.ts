import {Component, OnInit, ViewChild, OnDestroy, TemplateRef} from '@angular/core';
import {LocationService} from './location.service';
import {Location} from './location';
import {Validators, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TableOptions, ColumnMode, TableColumn} from 'angular2-data-table';
import {FormService} from '../../shared/form/form.service';
import {FormField} from '../../shared/form/form-field';

@Component({
  selector: 'location-component',
  template: require('./location.component.html')
})
export class LocationComponent implements OnInit, OnDestroy {

  @ViewChild('editContentModal') editContentModal;

  @ViewChild('editRowTmpl') editRowTmpl: TemplateRef<any>;

  @ViewChild('removeRowTmpl') removeRowTmpl: TemplateRef<any>;

  @ViewChild('confirmModal') confirmModal;

  locationForm: FormGroup;

  locations: Location[] = [];

  dtOptions: TableOptions;

  locationsSubscription: Subscription;

  formSubscription: Subscription;

  formErrors: {[key: string]: string} = {};

  creation: boolean;

  constructor(private locationService: LocationService, private formService: FormService) {
  }

  ngOnInit() {
    this.locationsSubscription = this.locationService.findAll().subscribe(locations => this.locations = locations);
    this.dtOptions = new TableOptions({
      reorderable: false,
      footerHeight: 50,
      columnMode: ColumnMode.force,
      rowHeight: 'auto',
      limit: 3,
      columns: [
        new TableColumn({name: 'Nom du site', prop: 'name'}),
        new TableColumn({name: 'Ville', prop: 'city'}),
        new TableColumn({name: 'Modifier', template: this.editRowTmpl, sortable: false, canAutoResize: false}),
        new TableColumn({name: 'Supprimer', template: this.removeRowTmpl, sortable: false, canAutoResize: false})
      ]
    });
  }

  ngOnDestroy() {
    this.locationsSubscription.unsubscribe();
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  saveModal(location: Location) {
    this.formErrors = {};
    this.creation = !location;
    const formMessages = this.formService.buildForm({
      name: new FormField([location ? location.name : '', Validators.required], {
        required: 'Le nom du site de formation est requis'
      }),
      city: new FormField([location ? location.city : '', Validators.required], {
        required: 'La ville du site de formation est requise'
      })
    });
    this.locationForm = formMessages.formGroup;
    this.formSubscription = this.locationForm.valueChanges.subscribe(d => this.formErrors = this.formService.validate(d, formMessages));
    this.locationsSubscription = this.locationService.saveModal(this.editContentModal, location)
      .subscribe(locations => this.locations = locations);
  }

  remove(location: Location) {
    this.locationsSubscription = this.locationService.removeModal(this.confirmModal, location)
      .subscribe(locations => this.locations = locations);
  }

}
