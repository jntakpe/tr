import {Component, OnInit} from '@angular/core';
import {TopbarComponent} from './topbar/topbar.component';
import {NavbarComponent} from './navbar/navbar.component';

@Component({
  selector: 'header-component',
  template: require('./header.component.html'),
  directives: [TopbarComponent, NavbarComponent]
})
export class HeaderComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
