import {Component, OnInit} from '@angular/core';
import {AlertService} from '../shared/alert.service';

@Component({
  selector: 'tr-home-component',
  templateUrl: './home.component.html',
  providers: [AlertService]
})
export class HomeComponent implements OnInit {

  ngOnInit() {
  }

}
