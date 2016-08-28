import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {LoginService} from './login.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'login-component',
  template: require('./login.component.html'),
  styles: [require('./login.component.scss')]
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('username') usernameInput: ElementRef;

  loginForm: FormGroup;

  private portalBgClass = 'portalbg';

  private loginSubscription: Subscription;

  constructor(private loginService: LoginService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    document.querySelector('body').classList.add(this.portalBgClass);
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loginService.focusElement(this.usernameInput);
    this.loginService.displayRedirectMessage(this.activatedRoute.snapshot.queryParams);
  }

  ngOnDestroy() {
    document.querySelector('body').classList.remove(this.portalBgClass);
    this.loginSubscription.unsubscribe();
  }

  login() {
    this.loginSubscription = this.loginService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(user => this.loginService.redirectHome(),
        error => this.loginService.handleLoginError(error, this.loginForm, this.usernameInput));
  }

}
