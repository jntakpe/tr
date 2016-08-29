import {NgModule} from '@angular/core';
import {BreadcrumbsComponent} from './breadcrumbs.component';
import {BreadcrumbsService} from './breadcrumbs.service';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [RouterModule, CommonModule],
  exports: [BreadcrumbsComponent],
  providers: [BreadcrumbsService]
})
export class BreadcrumbsModule {

}
