import {async} from '@angular/core/testing/async';
import {TestBed} from '@angular/core/testing/test_bed';
import {LoginComponent} from './login.component';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {SecurityModule} from '../security.module';
import {FormGroup} from '@angular/forms';
import {By} from '@angular/platform-browser/src/dom/debug/by';
import {dispatchEvent} from '@angular/platform-browser/testing/browser_util';
import {LoginService} from './login.service';
import {Observable} from 'rxjs';
import {User} from '../user';

describe('Login component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SecurityModule, RouterTestingModule],
    });
  });

  describe('without mocking', () => {
    beforeEach(async(() => {
      TestBed.compileComponents();
    }));

    it('it should create login component', async(() => {
      const component = TestBed.createComponent(LoginComponent).componentInstance;

      expect(component).toBeTruthy();
    }));

    it('it should have empty form', async(() => {
      const fixture = TestBed.createComponent(LoginComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('input[name="username"]').value).toBe('');
      expect(compiled.querySelector('input[name="password"]').value).toBe('');
    }));

    it('it should disable form submit if empty fields', async(() => {
      const fixture = TestBed.createComponent(LoginComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('button:disabled')).toBeTruthy();
    }));

    it('it should enable form submit if fields not empty', async(() => {
      const fixture = TestBed.createComponent(LoginComponent);
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


    it('it should disable form submit if password empty after being set', async(() => {
      const fixture = TestBed.createComponent(LoginComponent);
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
  });

  class MockLoginService extends LoginService {

    login(username: string, password: string): Observable<User> {
      if (username === 'jntakpe' && password === 'test') {
        return Observable
          .of(new User('jntakpe', ['ROLE_ADMIN', 'ROLE_USER']));
      }
      return null;
    }
  }

});
