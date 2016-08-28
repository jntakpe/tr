import {NgModule} from '@angular/core';
import {BreadcrumbsComponent} from './breadcrumbs.component';
import {BreadcrumbsService} from './breadcrumbs.service';
import {SharedModule} from '../../shared.module';

@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [SharedModule],
  exports: [BreadcrumbsComponent],
  providers: [BreadcrumbsService]
})
export class BreadcrumbsModule {

}
