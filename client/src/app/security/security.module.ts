import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {SecurityService} from './security.service';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

@NgModule({
  imports: [ReactiveFormsModule, HttpModule],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [SecurityService]
})
export class SecurityModule {
}
