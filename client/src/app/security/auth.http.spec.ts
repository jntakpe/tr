import {HttpModule, BaseRequestOptions, Http, Response} from '@angular/http';
import {TestBed, inject} from '@angular/core/testing/test_bed';
import {SecurityService} from './security.service';
import {NavigationService} from '../shared/navigation.service';
import {MockBackend, MockConnection} from '@angular/http/testing/mock_backend';
import {RouterModule, Routes, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {AuthHttp} from './auth.http';
import {RootComponent, FakeLoginComponent, createRoot, advance} from '../shared/test/test-utils';
import {fakeAsync} from '@angular/core/testing/fake_async';
import {Location} from '@angular/common';
import {Observable} from 'rxjs';

describe('auth http', () => {

  describe('with token', () => {

    const routes: Routes = [
      {path: '', component: RootComponent},
      {path: 'login', component: FakeLoginComponent}
    ];

    class MockSecurityService extends SecurityService {

      isTokenStillValid(token = this.getToken()): boolean {
        return true;
      }

      getToken(): any {
        return {yep: 'sdf'};
      }

      loginWithRefresh(token?): Observable<string> {
        return Observable.of('refreshtoken');
      }
    }

    class MockNavigationService extends NavigationService {

      goToLoginPage() {
      }

    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RootComponent, FakeLoginComponent],
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild(routes)],
        providers: [
          AuthHttp,
          NavigationService,
          MockBackend,
          BaseRequestOptions,
          {provide: SecurityService, useValue: new MockSecurityService(null)},
          {
            provide: Http,
            useFactory: (backend, defaultOptions) => {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          }]
      });
    });

    function withAuthHeader(connection: MockConnection) {
      expect(connection.request.headers.get('Authorization')).toContain('Bearer ');
    }

    function unauthorizedResponse(connection: MockConnection) {
      const error = new Error('err');
      error['status'] = 401;
      error['url'] = connection.request.url;
      connection.mockError(error);
    }

    function expectUnauthorizedAndRedirectToLogin(res: Response) {
      expect(res.status).toBe(401);
    }

    it('should http get with token', inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(withAuthHeader);
      authHttp.get('test');
    }));

    it('should http post with token', inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(withAuthHeader);
      authHttp.post('test', 'test');
    }));

    it('should http put with token', inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(withAuthHeader);
      authHttp.put('test', 'test');
    }));

    it('should http delete with token', inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(withAuthHeader);
      authHttp.delete('test');
    }));

    it('should reject get cuz 401 and redirect to login', fakeAsync(inject([AuthHttp, MockBackend, Router, Location],
      (authHttp: AuthHttp, mockBackend: MockBackend, router: Router, location: Location) => {
        const fixture = createRoot(router, RootComponent);
        mockBackend.connections.subscribe(unauthorizedResponse);
        authHttp.get('test').subscribe(expectUnauthorizedAndRedirectToLogin);
        advance(fixture);
        expect(location.path()).toBe('/login?from=expired');
      })));

    it('should reject post cuz 401 and redirect to login', fakeAsync(inject([AuthHttp, MockBackend, Router, Location],
      (authHttp: AuthHttp, mockBackend: MockBackend, router: Router, location: Location) => {
        const fixture = createRoot(router, RootComponent);
        mockBackend.connections.subscribe(unauthorizedResponse);
        authHttp.post('test', 'test').subscribe(expectUnauthorizedAndRedirectToLogin);
        advance(fixture);
        expect(location.path()).toBe('/login?from=expired');
      })));

    it('should reject put cuz 401 and redirect to login', fakeAsync(inject([AuthHttp, MockBackend, Router, Location],
      (authHttp: AuthHttp, mockBackend: MockBackend, router: Router, location: Location) => {
        const fixture = createRoot(router, RootComponent);
        mockBackend.connections.subscribe(unauthorizedResponse);
        authHttp.put('test', 'test').subscribe(expectUnauthorizedAndRedirectToLogin);
        advance(fixture);
        expect(location.path()).toBe('/login?from=expired');
      })));

    it('should reject delete cuz 401 and redirect to login', fakeAsync(inject([AuthHttp, MockBackend, Router, Location],
      (authHttp: AuthHttp, mockBackend: MockBackend, router: Router, location: Location) => {
        const fixture = createRoot(router, RootComponent);
        mockBackend.connections.subscribe(unauthorizedResponse);
        authHttp.delete('test').subscribe(expectUnauthorizedAndRedirectToLogin);
        advance(fixture);
        expect(location.path()).toBe('/login?from=expired');
      })));

  });

  describe('without token', () => {

    class MockSecurityService extends SecurityService {

      isTokenStillValid(token = this.getToken()): boolean {
        return false;
      }

      getToken(): any {
        return {yep: 'sdf'};
      }

      loginWithRefresh(token?): Observable<string> {
        return Observable.of('refreshtoken');
      }
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
        providers: [
          AuthHttp,
          NavigationService,
          MockBackend,
          BaseRequestOptions,
          {provide: SecurityService, useValue: new MockSecurityService(null)},
          {
            provide: Http,
            useFactory: (backend, defaultOptions) => {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          }]
      });
    });

    function withoutAuthHeader(connection: MockConnection) {
      expect(connection.request.headers.get('Authorization')).toBeFalsy();
    }

    it('should not http get with token', inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(withoutAuthHeader);
      authHttp.get('test');
    }));

    it('should not http post with token', inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(withoutAuthHeader);
      authHttp.post('test', 'test');
    }));

    it('should not http put with token', inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(withoutAuthHeader);
      authHttp.put('test', 'test');
    }));

    it('should not http delete with token', inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(withoutAuthHeader);
      console.log(authHttp);
      authHttp.delete('test');
    }));

  });

});
