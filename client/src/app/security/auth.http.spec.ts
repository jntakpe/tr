import { TestBed, inject, async, fakeAsync } from '@angular/core/testing';
import { HttpModule, BaseRequestOptions, Http, ResponseOptions, Response } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing/router_testing_module';
import { RouterModule } from '@angular/router';
import { AuthHttp } from './auth.http';
import { AlertService } from '../shared/alert.service';
import { NavigationService } from '../shared/navigation.service';
import { MockBackend, MockConnection } from '@angular/http/testing/mock_backend';
import { SecurityService } from './security.service';
import { tokenJson } from '../shared/test/test-utils';
import { Observable } from 'rxjs/Observable';
import '../shared/rxjs.extension';

describe('auth http', () => {

  describe('with token in localstorage', () => {

    class MockSecurityService extends SecurityService {

      isTokenStillValid(token = this.getToken()): boolean {
        return true;
      }

      getToken(): any {
        return tokenJson;
      }

    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
        providers: [
          AuthHttp,
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
          },
          {provide: SecurityService, useClass: MockSecurityService}
        ]
      });
    });

    function expectRequestToHaveAuthHeader(connection: MockConnection) {
      expect(connection.request.headers.get('Authorization')).toContain('Bearer ' + tokenJson.access_token);
      connection.mockRespond(new Response(new ResponseOptions({body: {test: 'test'}})));
    }

    it('should http get with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.get('some url').subscribe(res => expect(res.json().test).toBe('test'), () => fail('get should not fail'));
    })));

    it('should http post with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.post('some url', 'test').subscribe(res => expect(res.json().test).toBe('test'), () => fail('post should not fail'));
    })));

    it('should http put with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.put('some url', 'test').subscribe(res => expect(res.json().test).toBe('test'), () => fail('put should not fail'));
    })));

    it('should http delete with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.delete('some url').subscribe(res => expect(res.json().test).toBe('test'), () => fail('delete should not fail'));
    })));

  });

  describe('with invalid access token but valid refresh token', () => {

    class MockSecurityService extends SecurityService {

      isTokenStillValid(token = this.getToken()): boolean {
        return false;
      }

      getToken(): any {
        return tokenJson;
      }

      loginWithRefresh(token: any = this.getToken()): Observable<string> {
        return Observable.of(tokenJson.access_token);
      }
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
        providers: [
          AuthHttp,
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
          },
          {provide: SecurityService, useClass: MockSecurityService}
        ]
      });
    });

    function expectRequestToHaveAuthHeader(connection: MockConnection) {
      expect(connection.request.headers.get('Authorization')).toContain('Bearer ' + tokenJson.access_token);
      connection.mockRespond(new Response(new ResponseOptions({body: {test: 'test'}})));
    }

    it('should refresh http get with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.get('some url').subscribe(res => expect(res.json().test).toBe('test'), () => fail('get should not fail'));
    })));

    it('should refresh http post with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.post('some url', 'test').subscribe(res => expect(res.json().test).toBe('test'), () => fail('post should not fail'));
    })));

    it('should refresh http put with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.put('some url', 'test').subscribe(res => expect(res.json().test).toBe('test'), () => fail('put should not fail'));
    })));

    it('should refresh http delete with token', async(inject([AuthHttp, MockBackend], (authHttp: AuthHttp, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(expectRequestToHaveAuthHeader);
      authHttp.delete('some url').subscribe(res => expect(res.json().test).toBe('test'), () => fail('delete should not fail'));
    })));
  });

  describe('with invalid access token and invalid refresh token', () => {

    class MockSecurityService extends SecurityService {

      isTokenStillValid(token = this.getToken()): boolean {
        return false;
      }

      getToken(): any {
        return tokenJson;
      }

      loginWithRefresh(token: any = this.getToken()): Observable<string> {
        const error = new Error('cant refresh token');
        error['status'] = 401;
        return Observable.throw(error);
      }
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
        providers: [
          AuthHttp,
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
          },
          {provide: SecurityService, useClass: MockSecurityService}
        ]
      });
    });

    it('should not refresh http get with token', fakeAsync(inject([AuthHttp, NavigationService],
      (authHttp: AuthHttp, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        authHttp.get('some url').subscribe();
        expect(navigationService.goToLoginPage).toHaveBeenCalledWith('expired');
      })));

    it('should not refresh http post with token', fakeAsync(inject([AuthHttp, NavigationService],
      (authHttp: AuthHttp, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        authHttp.post('some url', 'test').subscribe();
        expect(navigationService.goToLoginPage).toHaveBeenCalledWith('expired');
      })));

    it('should not refresh http put with token', fakeAsync(inject([AuthHttp, NavigationService],
      (authHttp: AuthHttp, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        authHttp.put('some url', 'test').subscribe();
        expect(navigationService.goToLoginPage).toHaveBeenCalledWith('expired');
      })));

    it('should not refresh http delete with token', fakeAsync(inject([AuthHttp, NavigationService],
      (authHttp: AuthHttp, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        authHttp.delete('some url').subscribe();
        expect(navigationService.goToLoginPage).toHaveBeenCalledWith('expired');
      })));
  });

  describe('with no token at all', () => {

    class MockSecurityService extends SecurityService {

      getToken(): any {
        return;
      }

    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
        providers: [
          AuthHttp,
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
          },
          {provide: SecurityService, useClass: MockSecurityService}
        ]
      });
    });

    it('should not refresh http get without token', fakeAsync(inject([AuthHttp, MockBackend, NavigationService],
      (authHttp: AuthHttp, mockBackend: MockBackend, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        authHttp.get('some url').subscribe();
        expect(navigationService.goToLoginPage).toHaveBeenCalledWith('unauthorized');
      })));

    it('should not refresh http post without token', fakeAsync(inject([AuthHttp, MockBackend, NavigationService],
      (authHttp: AuthHttp, mockBackend: MockBackend, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        authHttp.post('some url', 'test');
        expect(navigationService.goToLoginPage).toHaveBeenCalledWith('unauthorized');
      })));

    it('should not refresh http put without token', fakeAsync(inject([AuthHttp, MockBackend, NavigationService],
      (authHttp: AuthHttp, mockBackend: MockBackend, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        authHttp.put('some url', 'test');
        expect(navigationService.goToLoginPage).toHaveBeenCalledWith('unauthorized');
      })));

    it('should not refresh http delete without token', fakeAsync(inject([AuthHttp, MockBackend, NavigationService],
      (authHttp: AuthHttp, mockBackend: MockBackend, navigationService: NavigationService) => {
        spyOn(navigationService, 'goToLoginPage');
        authHttp.delete('some url');
        expect(navigationService.goToLoginPage).toHaveBeenCalledWith('unauthorized');
      })));
  });

});
