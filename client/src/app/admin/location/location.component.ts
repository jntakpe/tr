import {Component, OnInit, ViewChild, OnDestroy, TemplateRef} from '@angular/core';
import {LocationService} from './location.service';
import {Location} from './location';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TableOptions, ColumnMode, TableColumn} from 'angular2-data-table';

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

  formErrors: any = {};

  validationMsgs: any = {
    name: {
      required: 'Le nom du site de formation est requis'
    },
    city: {
      required: 'La ville du site de formation est requise'
    }
  };

  creation: boolean;

  constructor(private locationService: LocationService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.locationsSubscription = this.locationService.findAll().subscribe(locations => this.locations = locations);
    this.dtOptions = new TableOptions({
      reorderable: false,
      columnMode: ColumnMode.force, rowHeight: 'auto', limit: 10,
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
    this.locationForm = this.formBuilder.group({
      name: [location ? location.name : '', Validators.required],
      city: [location ? location.city : '', Validators.required]
    });
    this.formErrors = {};
    this.formSubscription = this.locationForm.valueChanges.subscribe(d => this.onValueChanged(d));
    this.creation = !location;
    this.locationsSubscription = this.locationService.saveModal(this.editContentModal, location)
      .subscribe(locations => this.locations = locations);
  }

  remove(location: Location) {
    this.locationsSubscription = this.locationService.removeModal(this.confirmModal, location)
      .subscribe(locations => this.locations = locations);
  }

  private onValueChanged(data?: any) {
    console.log(data);
    for (const field in data) {
      if (data.hasOwnProperty(field)) {
        const control = this.locationForm.get(field);
        if (control && control.dirty && control.invalid) {
          for (const error in control.errors) {
            if (control.errors.hasOwnProperty(error)) {
              const message = this.validationMsgs[field] && this.validationMsgs[field][error];
              if (message) {
                this.formErrors[field] = message;
                break;
              }
            }
          }
        } else {
          delete this.formErrors[field];
        }
      }
    }
  }

}
