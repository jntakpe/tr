import {NgModule} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {layoutRouting} from './layout.routing';
import {HomeModule} from '../../home/home.module';
import {HeaderModule} from './header/header.module';
import {SharedModule} from '../shared.module';
import {FooterModule} from './footer/footer.module';
import {BreadcrumbsModule} from './breadcrumbs/breadcrumbs.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [SharedModule, HeaderModule, BreadcrumbsModule, FooterModule, HomeModule, layoutRouting],
  exports: [LayoutComponent]
})
export class LayoutModule {

}
