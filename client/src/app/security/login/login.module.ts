import {SharedModule} from '../../shared/shared.module';
import {LoginComponent} from './login.component';
import {LoginService} from './login.service';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [SharedModule],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [LoginService]
})
export class LoginModule {

}
