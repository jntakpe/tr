import {async} from '@angular/core/testing/async';
import {TestBed, inject} from '@angular/core/testing/test_bed';
import {LoginComponent} from './login.component';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser/src/dom/debug/by';
import {dispatchEvent} from '@angular/platform-browser/testing/browser_util';
import {SecurityService} from '../security.service';
import {Observable} from 'rxjs';
import {User} from '../user';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {advance} from '../../shared/test/test-utils';
import {fakeAsync} from '@angular/core/testing/fake_async';
import {RouterModule} from '@angular/router';
import {NavigationService} from '../../shared/navigation.service';
import {LoginService} from './login.service';
import {HttpModule, Response} from '@angular/http';
import {AlertService} from '../../shared/alert.service';
import {ElementRef} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing/component_fixture';

describe('Login component', () => {

  let fixture: ComponentFixture<LoginComponent>;

  class MockLoginService extends LoginService {

    login(username: string, password: string): Observable<any> {
      if (username === 'jntakpe' && password === 'test') {
        return Observable.of(new User('jntakpe', ['ROLE_ADMIN']));
      }
      return Observable.throw(new Error('Some error'));
    }

    handleLoginError(error: Response, form: FormGroup, inputElement: ElementRef): void {
    }

    redirectHome(): void {
    }

    displayRedirectMessage(): void {
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, HttpModule, RouterTestingModule, RouterModule.forChild([])],
      providers: [
        {provide: LoginService, useValue: new MockLoginService(null, null, null)},
        SecurityService,
        NavigationService,
        AlertService
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
  });

  it('should create login component', async(() => {
    expect(fixture.componentInstance).toBeTruthy();
  }));

  it('should have empty form', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('input[name="username"]').value).toBe('');
    expect(compiled.querySelector('input[name="password"]').value).toBe('');
  }));

  it('should disable form submit if empty fields', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button:disabled')).toBeTruthy();
  }));

  it('should enable form submit if fields not empty', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const usernameInput = fixture.debugElement.query(By.css('input[name="username"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]'));
    const updatedValue = 'updatedValue';
    usernameInput.nativeElement.value = updatedValue;
    passwordInput.nativeElement.value = updatedValue;
    dispatchEvent(usernameInput.nativeElement, 'input');
    dispatchEvent(passwordInput.nativeElement, 'input');
    const form: FormGroup = fixture.debugElement.componentInstance.loginForm;
    fixture.detectChanges();
    expect(form.value.username).toBe(updatedValue);
    expect(form.value.password).toBe(updatedValue);
    expect(compiled.querySelector('button:not(:disabled)')).toBeTruthy();
  }));


  it('should disable form submit if password empty after being set', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const usernameInput = fixture.debugElement.query(By.css('input[name="username"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]'));
    const updatedValue = 'updatedValue';
    usernameInput.nativeElement.value = updatedValue;
    passwordInput.nativeElement.value = updatedValue;
    dispatchEvent(usernameInput.nativeElement, 'input');
    dispatchEvent(passwordInput.nativeElement, 'input');
    const form: FormGroup = fixture.debugElement.componentInstance.loginForm;
    fixture.detectChanges();
    expect(form.value.username).toBe(updatedValue);
    expect(form.value.password).toBe(updatedValue);
    expect(compiled.querySelector('button:not(:disabled)')).toBeTruthy();
    passwordInput.nativeElement.value = '';
    dispatchEvent(passwordInput.nativeElement, 'input');
    fixture.detectChanges();
    expect(form.value.password).toBe('');
    expect(compiled.querySelector('button:not(:disabled)')).toBeFalsy();
    expect(compiled.querySelector('button:disabled')).toBeTruthy();
  }));

  it('should log in user and call redirect home', fakeAsync(inject([LoginService], (loginService: LoginService) => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const usernameInput = fixture.debugElement.query(By.css('input[name="username"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]'));
    usernameInput.nativeElement.value = 'jntakpe';
    passwordInput.nativeElement.value = 'test';
    dispatchEvent(usernameInput.nativeElement, 'input');
    dispatchEvent(passwordInput.nativeElement, 'input');
    fixture.detectChanges();
    spyOn(loginService, 'redirectHome');
    compiled.querySelector('button').click();
    advance(fixture);
    expect(loginService.redirectHome).toHaveBeenCalled();
  })));

  it('should fail log in user and display message', fakeAsync(inject([LoginService], (loginService: LoginService) => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const usernameInput = fixture.debugElement.query(By.css('input[name="username"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]'));
    usernameInput.nativeElement.value = 'toto';
    passwordInput.nativeElement.value = 'titi';
    dispatchEvent(usernameInput.nativeElement, 'input');
    dispatchEvent(passwordInput.nativeElement, 'input');
    fixture.detectChanges();
    spyOn(loginService, 'handleLoginError');
    compiled.querySelector('button').click();
    advance(fixture);
    expect(loginService.handleLoginError).toHaveBeenCalled();
  })));

  it('should init component', async(inject([LoginService], (loginService: LoginService) => {
    spyOn(loginService, 'displayRedirectMessage');
    fixture.detectChanges();
    expect(loginService.displayRedirectMessage).toHaveBeenCalled();
  })));

});
