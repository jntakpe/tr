import {Component, OnInit} from "@angular/core";
import {TopbarComponent} from "./topbar/topbar.component";

@Component({
  selector: 'headerbar',
  template: require('./header.component.html'),
  directives: [TopbarComponent]
})
export class HeaderComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
