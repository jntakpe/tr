import {NgModule} from '@angular/core';
import {TopbarModule} from './topbar/topbar.module';
import {HeaderComponent} from './header.component';
import {NavbarModule} from './navbar/navbar.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [TopbarModule, NavbarModule, RouterModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule {

}
