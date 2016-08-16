import {Component, OnInit} from '@angular/core';
import {SecurityService} from '../../../../security/security.service';

@Component({
  selector: 'topbar-component',
  template: require('./topbar.component.html')
})
export class TopbarComponent implements OnInit {

  username: string;

  constructor(private securityService: SecurityService) {
  }

  ngOnInit() {
    console.log(this.securityService.getCurrentUser());
  }

}
