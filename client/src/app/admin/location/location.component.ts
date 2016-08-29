import {Component, OnInit} from '@angular/core';
import {LocationService} from './location.service';
import {Observable} from 'rxjs';
import {Location} from './location';

@Component({
  selector: 'location-component',
  template: require('./location.component.html')
})
export class LocationComponent implements OnInit {

  locations: Observable<Location>;

  constructor(private locationService: LocationService) {
  }

  ngOnInit() {
    this.locations = this.locationService.findAll();
  }

}
