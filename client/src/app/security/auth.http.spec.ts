import {HttpModule, BaseRequestOptions, Http, Response} from '@angular/http';
import {TestBed, inject} from '@angular/core/testing/test_bed';
import {SecurityService} from './security.service';
import {NavigationService} from '../shared/navigation.service';
import {MockBackend, MockConnection} from '@angular/http/testing/mock_backend';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {AuthHttp} from './auth.http';

describe('auth http', () => {

  describe('with token', () => {

    class MockSecurityService extends SecurityService {

      isTokenStillValid(token = this.getToken()): boolean {
        return true;
      }

      getToken(): any {
        return {yep: 'sdf'};
      }
    }

    class MockNavigationService extends NavigationService {

      goToLoginPage() {
      }

    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
        providers: [
          AuthHttp,
          MockBackend,
          BaseRequestOptions,
          {provide: SecurityService, useValue: new MockSecurityService(null)},
          {provide: NavigationService, useValue: new MockNavigationService(null)},
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

    function expectUnauthorizedAndRedirectToLogin(res: Response, navigationService: NavigationService) {
      expect(res.status).toBe(401);
      expect(navigationService.goToHomePage).toHaveBeenCalled();
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

    it('should reject get cuz 401 and redirect to login', inject([AuthHttp, MockBackend, NavigationService],
      (authHttp: AuthHttp, mockBackend: MockBackend, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        mockBackend.connections.subscribe(unauthorizedResponse);
        authHttp.get('test').subscribe(res => expectUnauthorizedAndRedirectToLogin(res, navigationService));
      }));

    it('should reject post cuz 401 and redirect to login', inject([AuthHttp, MockBackend, NavigationService],
      (authHttp: AuthHttp, mockBackend: MockBackend, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        mockBackend.connections.subscribe(unauthorizedResponse);
        authHttp.post('test', 'test').subscribe(res => expectUnauthorizedAndRedirectToLogin(res, navigationService));
      }));

    it('should reject put cuz 401 and redirect to login', inject([AuthHttp, MockBackend, NavigationService],
      (authHttp: AuthHttp, mockBackend: MockBackend, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        mockBackend.connections.subscribe(unauthorizedResponse);
        authHttp.put('test', 'test').subscribe(res => expectUnauthorizedAndRedirectToLogin(res, navigationService));
      }));

    it('should reject delete cuz 401 and redirect to login', inject([AuthHttp, MockBackend, NavigationService],
      (authHttp: AuthHttp, mockBackend: MockBackend, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        mockBackend.connections.subscribe(unauthorizedResponse);
        authHttp.delete('test').subscribe(res => expectUnauthorizedAndRedirectToLogin(res, navigationService));
      }));

  });

  describe('without token', () => {

    class MockSecurityService extends SecurityService {

      isTokenStillValid(token = this.getToken()): boolean {
        return false;
      }

      getToken(): any {
        return {yep: 'sdf'};
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
      authHttp.delete('test');
    }));

  });

});
