import { Component, OnInit } from '@angular/core';
import { AlertService } from '../shared/alert.service';
import { HomeService } from './home.service';

@Component({
  selector: 'tr-home-component',
  templateUrl: './home.component.html',
  providers: [AlertService]
})
export class HomeComponent implements OnInit {

  constructor(homeService: HomeService) {
  }

  ngOnInit() {
  }

}
