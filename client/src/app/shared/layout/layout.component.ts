import {Component} from '@angular/core';
import {FooterComponent} from './footer/footer.component';
import {BreadcrumbsComponent} from './breadcrumbs/breadcrumbs.component';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'layout-component',
  template: require('./layout-component.html'),
  directives: [HeaderComponent, BreadcrumbsComponent, FooterComponent]
})
export class LayoutComponent {

}
