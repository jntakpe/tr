import {Component} from "@angular/core";
import {HeaderComponent} from "./shared/layout/header/header.component";
import {BreadcrumbsComponent} from "./shared/layout/breadcrumbs/breadcrumbs.component";
import {FooterComponent} from "./shared/layout/footer/footer.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  directives: [HeaderComponent, BreadcrumbsComponent, FooterComponent]
})
export class AppComponent {
  title = 'app works!';
}
