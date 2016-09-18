import {NgModule} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {layoutRouting} from './layout.routing';
import {HomeModule} from '../../home/home.module';
import {HeaderModule} from './header/header.module';
import {FooterModule} from './footer/footer.module';
import {BreadcrumbsModule} from './breadcrumbs/breadcrumbs.module';
import {AdminModule} from '../../admin/admin.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [HeaderModule, BreadcrumbsModule, FooterModule, HomeModule, AdminModule, layoutRouting],
  exports: [LayoutComponent]
})
export class LayoutModule {

}
