import {Component} from "@angular/core";
import * as moment from "moment";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  title = 'app works! ' + moment();
}
