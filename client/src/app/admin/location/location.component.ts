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

  constructor(private locationService: LocationService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.locationsSubscription = this.locationService.findAll().subscribe(locations => this.locations = locations);
  }

  ngOnDestroy() {
    this.locationsSubscription.unsubscribe();
  }

  openModal() {
    this.locationForm = this.formBuilder.group({
      name: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.locationsSubscription = this.locationService.saveModal(this.editContentModal)
      .flatMap(() => this.locationService.findAll())
      .subscribe(locations => this.locations = locations);
  }

}
