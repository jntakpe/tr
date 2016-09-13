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

  private _locations: Location[] = [];

  saveForm: FormGroup;

  searchForm: FormGroup;

  displayedLocations: Location[] = [];

  dtOptions: TableOptions;

  locationsSubscription: Subscription;

  saveFormSubscription: Subscription;

  searchFormSubscription: Subscription;

  formErrors: {[key: string]: string} = {};

  creation: boolean;

  constructor(private locationService: LocationService, private formService: FormService) {
  }

  ngOnInit() {
    this.locationsSubscription = this.locationService.findAll().subscribe(locations => this.locations = locations);
    this.dtOptions = this.buildTableOptions();
    this.initSearchForm();
  }

  ngOnDestroy() {
    this.locationsSubscription.unsubscribe();
    this.searchFormSubscription.unsubscribe();
    if (this.saveFormSubscription) {
      this.saveFormSubscription.unsubscribe();
    }
  }

  saveModal(location: Location) {
    this.formErrors = {};
    this.creation = !location;
    const formMessages = this.formService.buildValidationForm({
      name: new FormField([location ? location.name : null, Validators.required], {
        required: 'Le nom du site de formation est requis'
      }),
      city: new FormField([location ? location.city : null, Validators.required], {
        required: 'La ville du site de formation est requise'
      })
    });
    this.saveForm = formMessages.formGroup;
    this.saveFormSubscription = this.saveForm.valueChanges.subscribe(d => this.formErrors = this.formService.validate(d, formMessages));
    this.locationsSubscription = this.locationService.saveModal(this.editContentModal, location)
      .subscribe(locations => this.locations = locations);
  }

  remove(location: Location) {
    this.locationsSubscription = this.locationService.removeModal(this.confirmModal, location)
      .subscribe(locations => this.locations = locations);
  }

  private buildTableOptions(): TableOptions {
    return new TableOptions({
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

  private initSearchForm(): void {
    this.searchForm = this.formService.formBuilder.group({
      name: null,
      city: null
    });
    this.searchFormSubscription = this.searchForm.valueChanges
      .subscribe(d => this.displayedLocations = this.locationService.filterTable(this.locations, d));
  }

  set locations(locations: Location[]) {
    this._locations = locations;
    this.displayedLocations = locations;
  }

  get locations() {
    return this._locations;
  }

}
