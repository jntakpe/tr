import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {SecurityService} from './security.service';
import {SharedModule} from '../shared/shared.module';
import {securityRouting} from './security.routing';

@NgModule({
  imports: [SharedModule, securityRouting],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [SecurityService]
})
export class SecurityModule {
}
