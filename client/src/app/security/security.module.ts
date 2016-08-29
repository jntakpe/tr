import {NgModule} from '@angular/core';
import {SecurityService} from './security.service';
import {securityRouting} from './security.routing';
import {LoginModule} from './login/login.module';
import {AuthHttp} from './auth.http';

@NgModule({
  imports: [LoginModule, securityRouting],
  providers: [SecurityService, AuthHttp]
})
export class SecurityModule {
}
