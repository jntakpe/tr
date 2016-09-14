import {Component, OnInit, ViewChild, OnDestroy, TemplateRef} from '@angular/core';
import {LocationService} from './location.service';
import {Location} from './location';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TableOptions, ColumnMode, TableColumn} from 'angular2-data-table';
import {FormService} from '../../shared/form/form.service';
import {SaveModalComponent} from './modal/save-modal.component';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';

@Component({
  selector: 'location-component',
  template: require('./location.component.html')
})
export class LocationComponent implements OnInit, OnDestroy {

  @ViewChild('editRowTmpl') editRowTmpl: TemplateRef<any>;

  @ViewChild('removeRowTmpl') removeRowTmpl: TemplateRef<any>;

  @ViewChild('saveModal') saveModal: SaveModalComponent;

  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  displayedLocations: Location[] = [];

  dtOptions: TableOptions;

  locationsSubscription: Subscription;

  searchForm: FormGroup;

  searchFormSubscription: Subscription;

  private _locations: Location[] = [];

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
  }

  openSaveModal(location: Location) {
    this.locationsSubscription = this.saveModal.save(location).subscribe(locations => this.locations = locations);
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
      limit: 10,
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
      .subscribe(dataForm => this.displayedLocations = this.locationService.filterTable(this.locations, dataForm));
  }

  set locations(locations: Location[]) {
    this._locations = locations;
    this.displayedLocations = locations;
    this.initSearchForm();
  }

  get locations() {
    return this._locations;
  }

}
