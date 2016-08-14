import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {LoginService} from './login.service';

@Component({
  selector: 'login-component',
  template: require('./login.component.html'),
  styleUrls: ['login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private loginService: LoginService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.loginService.login(this.loginForm).subscribe(user => this.loginService.redirectHome(), error => console.log(error));
  }

}
