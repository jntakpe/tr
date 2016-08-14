import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {SecurityService} from './security.service';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [ReactiveFormsModule, HttpModule, RouterModule],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [SecurityService]
})
export class SecurityModule {
}
