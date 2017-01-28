import { TestBed, inject, fakeAsync } from '@angular/core/testing';
import { LoginService } from './login.service';
import { SecurityService } from '../security.service';
import { AlertService } from '../../shared/alert.service';
import { NavigationService } from '../../shared/navigation.service';
import { HttpModule, BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing/mock_backend';
import { mockTokenResponse, RootComponent, FakeHomeComponent, createRoot, advance, FakeLoginComponent } from '../../shared/test/test-utils';
import { RouterTestingModule } from '@angular/router/testing/router_testing_module';
import { RouterModule, Routes, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { dispatchEvent } from '@angular/platform-browser/testing/browser_util';
import { By } from '@angular/platform-browser/src/dom/debug/by';
import { Component, ViewChild, ElementRef } from '@angular/core';

describe('login service', () => {

  @Component({
    template: `<form [formGroup]="testGroup">
                <input name="focused" formControlName="focused" autofocus/>
                <input name="notfocused" formControlName="notfocused" #notfocused/>
              </form>`,
  })
  class TestComponent {

    @ViewChild('notfocused') notfocusedInput: ElementRef;

    testGroup: FormGroup;

    constructor(private formBuilder: FormBuilder) {
      this.testGroup = this.formBuilder.group({
        focused: [''],
        notfocused: ['']
      });
    }
  }

  const routes: Routes = [
    {path: '', component: RootComponent},
    {path: 'home', component: FakeHomeComponent},
    {path: 'login', component: FakeLoginComponent}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, FakeHomeComponent, RootComponent, FakeLoginComponent],
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule, RouterModule.forChild(routes)],
      providers: [
        LoginService,
        SecurityService,
        AlertService,
        NavigationService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }]
    });
  });

  it('should login user', inject([LoginService, MockBackend], (loginService: LoginService, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(c => mockTokenResponse(c));
    loginService.login('jntakpe', 'test').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.login).toBe('jntakpe');
    }, () => fail('should get token'));
  }));

  it('should fail cuz wrong username', inject([LoginService, MockBackend], (loginService: LoginService, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe(c => mockTokenResponse(c));
    loginService.login('toto', 'test').subscribe(() => fail('should not get success response'), (error) => expect(error).toBeTruthy());
  }));

  it('should redirect to home page', fakeAsync(inject([LoginService, Router, Location],
    (loginService: LoginService, router: Router, location: Location) => {
      const fixture = createRoot(router, RootComponent);
      loginService.redirectHome();
      advance(fixture);
      expect(location.path()).toBe('/home');
    })
  ));

  it('should call display error message', inject([LoginService, AlertService], (loginService: LoginService, alertService: AlertService) => {
    spyOn(alertService, 'error');
    const component = TestBed.createComponent(TestComponent).componentInstance;
    loginService.handleLoginError(new Response(new ResponseOptions({status: 400})), component.testGroup, component.notfocusedInput);
    expect(alertService.error).toHaveBeenCalled();
  }));

  it('should call display default error message', inject([LoginService, AlertService],
    (loginService: LoginService, alertService: AlertService) => {
      spyOn(alertService, 'defaultErrorMsg');
      const component = TestBed.createComponent(TestComponent).componentInstance;
      loginService.handleLoginError(new Response(new ResponseOptions({status: 500})), component.testGroup, component.notfocusedInput);
      expect(alertService.defaultErrorMsg).toHaveBeenCalled();
    }));

  it('should reset form', inject([LoginService], (loginService: LoginService) => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const focusedInput = fixture.debugElement.query(By.css('input[name="focused"]'));
    const notFocusedInput = fixture.debugElement.query(By.css('input[name="notfocused"]'));
    const updatedValue = 'updated';
    focusedInput.nativeElement.value = updatedValue;
    notFocusedInput.nativeElement.value = updatedValue;
    dispatchEvent(focusedInput.nativeElement, 'input');
    dispatchEvent(notFocusedInput.nativeElement, 'input');
    fixture.detectChanges();
    const testGroup: FormGroup = fixture.debugElement.componentInstance.testGroup;
    expect(testGroup.value.focused).toBe(updatedValue);
    expect(testGroup.value.notfocused).toBe(updatedValue);
    loginService.handleLoginError(new Response(new ResponseOptions({status: 500})), testGroup, component.notfocusedInput);
    expect(testGroup.value.focused).toBeFalsy();
    expect(testGroup.value.notfocused).toBeFalsy();
  }));

  it('should focus element', inject([LoginService], (loginService: LoginService) => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const testGroup: FormGroup = fixture.debugElement.componentInstance.testGroup;
    spyOn(component.notfocusedInput.nativeElement, 'focus');
    loginService.handleLoginError(new Response(new ResponseOptions({status: 500})), testGroup, component.notfocusedInput);
    expect(component.notfocusedInput.nativeElement.focus).toHaveBeenCalled();
  }));

  it('should focus element', inject([LoginService], (loginService: LoginService) => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component.notfocusedInput.nativeElement, 'focus');
    loginService.focusElement(component.notfocusedInput);
    expect(component.notfocusedInput.nativeElement.focus).toHaveBeenCalled();
  }));

  it('should display success logout message', fakeAsync(inject([LoginService, Router, AlertService],
    (loginService: LoginService, router: Router, alertService: AlertService) => {
      const fixture = createRoot(router, RootComponent);
      router.navigateByUrl('login?from=logout');
      advance(fixture);
      spyOn(alertService, 'success');
      loginService.displayRedirectMessage(router.routerState.snapshot.root.queryParams);
      expect(alertService.success).toHaveBeenCalledWith('Vous êtes à présent déconnecté', 'Deconnexion');
    })));

  it('should display error expired message', fakeAsync(inject([LoginService, Router, AlertService],
    (loginService: LoginService, router: Router, alertService: AlertService) => {
      const fixture = createRoot(router, RootComponent);
      router.navigateByUrl('login?from=expired');
      advance(fixture);
      spyOn(alertService, 'error');
      loginService.displayRedirectMessage(router.routerState.snapshot.root.queryParams);
      expect(alertService.error).toHaveBeenCalledWith('Votre session a expiré. Veuillez vous reconnecter', 'Expiration de session');
    })));

  it('should display error expired message', fakeAsync(inject([LoginService, Router, AlertService],
    (loginService: LoginService, router: Router, alertService: AlertService) => {
      const fixture = createRoot(router, RootComponent);
      router.navigateByUrl('login?from=unauthorized');
      advance(fixture);
      spyOn(alertService, 'error');
      loginService.displayRedirectMessage(router.routerState.snapshot.root.queryParams);
      expect(alertService.error).toHaveBeenCalledWith('Vous n\'êtes pas connecté. Veuillez vous connecter', 'Connexion obligatoire');
    })));

  it('should not display success logout message', fakeAsync(inject([LoginService, Router, AlertService],
    (loginService: LoginService, router: Router, alertService: AlertService) => {
      const fixture = createRoot(router, RootComponent);
      router.navigateByUrl('login?from=redirect');
      advance(fixture);
      spyOn(alertService, 'success');
      loginService.displayRedirectMessage(router.routerState.snapshot.root.queryParams);
      expect(alertService.success).not.toHaveBeenCalled();
    })));

  it('should not display success logout message', fakeAsync(inject([LoginService, Router, AlertService],
    (loginService: LoginService, router: Router, alertService: AlertService) => {
      const fixture = createRoot(router, RootComponent);
      router.navigateByUrl('login');
      advance(fixture);
      spyOn(alertService, 'success');
      loginService.displayRedirectMessage(router.routerState.snapshot.root.queryParams);
      expect(alertService.success).not.toHaveBeenCalled();
    })));
});
