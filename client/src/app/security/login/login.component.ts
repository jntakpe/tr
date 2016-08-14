import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {SecurityService} from '../security.service';

@Component({
  selector: 'login-component',
  template: require('./login.component.html'),
  styleUrls: ['login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  constructor(private securityService: SecurityService) {
  }

  ngOnInit() {
  }

  login() {
    this.securityService.login('jntakpe', 'test');
  }

}
