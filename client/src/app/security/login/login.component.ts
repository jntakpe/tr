import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {LoginService} from './login.service';

@Component({
  selector: 'login-component',
  template: require('./login.component.html'),
  styleUrls: ['login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  private portalBgClass = 'portalbg';

  constructor(private loginService: LoginService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    document.querySelector('body').classList.add(this.portalBgClass);
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    document.querySelector('body').classList.remove(this.portalBgClass);
  }

  login() {
    this.loginService.login(this.loginForm).subscribe(user => this.loginService.redirectHome(), error => console.log(error));
  }

}
