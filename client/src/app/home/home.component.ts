import {Component, OnInit} from '@angular/core';
import {AlertService} from "../shared/alert.service";

@Component({
  selector: 'home-component',
  template: require('./home.component.html'),
  providers : [AlertService]
})
export class HomeComponent implements OnInit {

  constructor(private _alert: AlertService) {

  }

  ngOnInit() {
    this._alert.info("HOME !!!!!!!!!!!!!!!!");
    this._alert.warning("HOME !!!!!!!!!!!!!!!!");
    this._alert.error("HOME !!!!!!!!!!!!!!!!");
  }

}
