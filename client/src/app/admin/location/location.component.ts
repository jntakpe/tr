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
  }

  saveModal(location: Location) {
    this.locationForm = this.formBuilder.group({
      name: [location ? location.name : '', Validators.required],
      city: [location ? location.city : '', Validators.required]
    });
    this.creation = !location;
    this.locationsSubscription = this.locationService.saveModal(this.editContentModal, location)
      .subscribe(locations => this.locations = locations);
  }

  remove(location: Location) {
    this.locationsSubscription = this.locationService.removeModal(this.confirmModal, location)
      .subscribe(locations => this.locations = locations);
  }

}
