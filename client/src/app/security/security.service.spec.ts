import {TestBed, inject} from '@angular/core/testing/test_bed';
import {SecurityService} from './security.service';
import {MockBackend, MockConnection} from '@angular/http/testing/mock_backend';
import {HttpModule, Http, BaseRequestOptions, ResponseOptions, Response} from '@angular/http';
import {User} from './user';

const tokenJson = require('./token-response.json');

describe('security service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        SecurityService,
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
    localStorage.clear();
  });

  it('should inject security service', inject([SecurityService], (securityService: SecurityService) => {
    expect(securityService).toBeTruthy();
  }));

  it('should extract user from token', inject([SecurityService, MockBackend],
    (securityService: SecurityService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => mockTokenResponse(c));
      securityService.login('jntakpe', 'test').subscribe(user => {
        expect(user).toBeTruthy();
        expect(user.login).toBe('jntakpe');
      }, () => fail('should get token'));
    }));

  it('should fail cuz wrong username', inject([SecurityService, MockBackend],
    (securityService: SecurityService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => mockTokenResponse(c));
      securityService.login('toto', 'test').subscribe(() => fail('should not get success response'), (error) => expect(error).toBeTruthy());
    }));

  it('should store token in localstorage', inject([SecurityService, MockBackend],
    (securityService: SecurityService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => mockTokenResponse(c));
      securityService.login('jntakpe', 'test').subscribe(() => {
        const token = JSON.parse(localStorage.getItem('tr_oauth2_auth'));
        expect(token.access_token).toBe(tokenJson.access_token);
      }, () => fail('should get token'));
    }));

  it('should get current user from memory', inject([SecurityService, MockBackend],
    (securityService: SecurityService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => mockTokenResponse(c));
      securityService.login('jntakpe', 'test').subscribe(() => {
        localStorage.clear();
        const currentUser: User = securityService.getCurrentUser();
        expect(currentUser).toBeTruthy();
        expect(currentUser.login).toBe('jntakpe');
      }, () => fail('should get token'));
    }));

  it('should get current user from localstorage', inject([SecurityService], (securityService: SecurityService) => {
    localStorage.setItem('tr_oauth2_auth', JSON.stringify(tokenJson));
    const currentUser = securityService.getCurrentUser();
    expect(currentUser).toBeTruthy();
    expect(currentUser.login).toBe('jntakpe');
  }));

  it('should not get current user', inject([SecurityService], (securityService: SecurityService) => {
    expect(securityService.getCurrentUser()).toBeFalsy();
  }));

  function mockTokenResponse(connection: MockConnection) {
    let valid: boolean = connection.request.getBody().indexOf('username=jntakpe&password=test') !== -1;
    expect(connection.request.url).toEqual('oauth/token');
    connection.mockRespond(new Response(valid ? new ResponseOptions({body: tokenJson}) : new ResponseOptions({status: 400})));
  }

});
