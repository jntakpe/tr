import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {LocationService} from './location.service';
import {Location} from './location';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'location-component',
  template: require('./location.component.html')
})
export class LocationComponent implements OnInit, OnDestroy {

  @ViewChild('editContentModal') editContentModal;

  locationForm: FormGroup;

  locations: Location[];

  locationsSubscription: Subscription;

  creation: boolean;

  constructor(private locationService: LocationService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.locationsSubscription = this.locationService.findAll().subscribe(locations => this.locations = locations);
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
      .flatMap(() => this.locationService.findAll())
      .subscribe(locations => this.locations = locations);
  }

  remove(location: Location) {
    console.log('// TODO remove');
  }

}
