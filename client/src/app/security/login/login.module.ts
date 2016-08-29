import {LoginComponent} from './login.component';
import {LoginService} from './login.service';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NavigationService} from '../../shared/navigation.service';
import {AlertService} from '../../shared/alert.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [ReactiveFormsModule, HttpModule],
  exports: [LoginComponent],
  providers: [LoginService, NavigationService, AlertService]
})
export class LoginModule {

}
