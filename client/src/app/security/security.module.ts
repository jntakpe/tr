import {NgModule} from '@angular/core';
import {SecurityService} from './security.service';
import {securityRouting} from './security.routing';
import {LoginModule} from './login/login.module';

@NgModule({
  imports: [LoginModule, securityRouting],
  providers: [SecurityService]
})
export class SecurityModule {
}
