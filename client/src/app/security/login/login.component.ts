import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {SecurityService} from '../security.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'login-component',
  template: require('./login.component.html'),
  styleUrls: ['login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private securityService: SecurityService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.securityService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(user => console.log(user));
  }

}
