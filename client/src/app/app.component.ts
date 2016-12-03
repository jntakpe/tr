import {Component, ViewContainerRef, OnInit, OnDestroy} from '@angular/core';
import {AlertService} from "./shared/alert.service";
import {ToastsManager} from "ng2-toastr";

@Component({
  selector: 'app-root',
  template: require('./app.component.html'),
  styles: [require('./app.component.scss')],
  providers: [AlertService]
})
export class AppComponent{

  constructor(public toastr: ToastsManager, vRef: ViewContainerRef){
    this.toastr.setRootViewContainerRef(vRef);
  }

}
