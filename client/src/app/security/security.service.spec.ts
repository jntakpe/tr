import {TestBed, inject} from '@angular/core/testing/test_bed';
import {SecurityService} from './security.service';
import {MockBackend} from '@angular/http/testing/mock_backend';
import {HttpModule, Http, BaseRequestOptions} from '@angular/http';
import {User} from './user';
import {mockTokenResponse, tokenJson} from '../shared/test/test-utils';

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
        const token = JSON.parse(localStorage.getItem(securityService.tokenKey));
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

  it('should logout current user', inject([SecurityService, MockBackend],
    (securityService: SecurityService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe(c => mockTokenResponse(c));
      securityService.login('jntakpe', 'test').subscribe(() => {
        expect(securityService.getCurrentUser()).toBeTruthy();
        securityService.logout();
        expect(securityService.getCurrentUser()).toBeFalsy();
        expect(localStorage.getItem(securityService.tokenKey)).toBeFalsy();
      }, (error) => fail('should get token'));
    }));


});
