import { Component, OnInit } from '@angular/core';
import { TopbarService } from './topbar.service';

@Component({
  selector: 'topbar-component',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  username: string;
  authorities: string;

  constructor(private topbarService: TopbarService) {
  }

  ngOnInit() {
    const {username, authorities} = this.topbarService.getUserInfos();
    this.username = username;
    this.authorities = authorities;
  }

  logout(): void {
    this.topbarService.logout();
  }

}
