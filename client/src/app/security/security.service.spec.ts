import {TestBed, inject} from '@angular/core/testing/test_bed';
import {SecurityService} from './security.service';
import {MockBackend, MockConnection} from '@angular/http/testing/mock_backend';
import {HttpModule, Http, BaseRequestOptions, ResponseOptions, Response} from '@angular/http';

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
  });

  it('should inject security service', inject([SecurityService], (securityService) => {
    expect(securityService).toBeTruthy();
  }));

  it('should extract user from token', inject([SecurityService, MockBackend], (securityService, mockBackend) => {
    mockBackend.connections.subscribe(c => mockTokenResponse(c));
    securityService.login('jntakpe', 'test').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.login).toBe('jntakpe');
    }, () => fail('should get token'));
  }));

  it('should fail cuz wrong username', inject([SecurityService, MockBackend], (securityService, mockBackend) => {
    mockBackend.connections.subscribe(c => mockTokenResponse(c));
    securityService.login('toto', 'test').subscribe(() => fail('should not get success response'), (error) => expect(error).toBeTruthy());
  }));


  function mockTokenResponse(connection: MockConnection) {
    let valid: boolean = connection.request.getBody().indexOf('username=jntakpe&password=test') !== -1;
    expect(connection.request.url).toEqual('oauth/token');
    connection.mockRespond(new Response(valid ? new ResponseOptions({body: tokenJson}) : new ResponseOptions({status: 400})));
  }

});
