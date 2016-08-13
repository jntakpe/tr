import {NgModule} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {layoutRouting} from './layout.routing';
import {HomeModule} from '../../home/home.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [HomeModule, layoutRouting],
  exports: [LayoutComponent]
})
export class LayoutModule {

}
