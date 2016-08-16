import {Component, OnInit} from '@angular/core';
import {TopbarService} from './topbar.service';

@Component({
  selector: 'topbar-component',
  template: require('./topbar.component.html'),
  providers: [TopbarService]
})
export class TopbarComponent implements OnInit {

  username: string;
  authorities: string;

  constructor(private topbarService: TopbarService) {
  }

  ngOnInit() {
    let {username, authorities} = this.topbarService.getCurrentUserWithFormattedAuthories();
    this.username = username;
    this.authorities = authorities
  }

}
