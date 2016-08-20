import {NgModule} from '@angular/core';
import {TopbarModule} from './topbar/topbar.module';
import {HeaderComponent} from './header.component';
import {NavbarModule} from './navbar/navbar.module';

@NgModule({
  imports: [TopbarModule, NavbarModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule {

}
