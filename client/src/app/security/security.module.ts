import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {SecurityService} from './security.service';

@NgModule({
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [SecurityService]
})
export class SecurityModule {
}
