import {Component} from "@angular/core";
import {HeaderComponent} from "./shared/layout/header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  directives: [HeaderComponent]
})
export class AppComponent {
  title = 'app works!';
}
