import {TestBed, inject} from '@angular/core/testing/test_bed';
import {HttpModule, BaseRequestOptions, Http, Response, ResponseOptions} from '@angular/http';
import {LocationService} from './location.service';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';
import {NavigationService} from '../../shared/navigation.service';
import {MockBackend, MockConnection} from '@angular/http/testing/mock_backend';
import {SecurityService} from '../../security/security.service';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {async} from '@angular/core/testing/async';
describe('location service', () => {

  class MockSecurityService extends SecurityService {

    isTokenStillValid(token = this.getToken()): boolean {
      return true;
    }

    getToken(): any {
      return {access_token: 'fake'};
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
      providers: [
        LocationService,
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

  it('should get locations', async(inject([LocationService, MockBackend], (locationService: LocationService, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe((conn: MockConnection) => {
      conn.mockRespond(new Response(new ResponseOptions({
        body: [
          {name: 'triangle', city: 'Paris'},
          {name: 'colo1', city: 'Toulouse'}
        ]
      })));
    });
    locationService.findAll().subscribe((locations) => {
      expect(locations).toBeTruthy();
      expect(locations instanceof Array).toBeTruthy();
      expect(locations[0].name).toBe('triangle');
    }, err => fail('error locations response'));
  })));

  it('should not get locations and display error message', async(inject([LocationService, MockBackend, AlertService],
    (locationService: LocationService, mockBackend: MockBackend, alertService: AlertService) => {
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        const error = new Error('test');
        error['status'] = 500;
        conn.mockError(error);
      });
      locationService.findAll().subscribe(res => fail('should fail'), () => {
        expect(alertService.error).toHaveBeenCalledWith('Impossible de récupérer la liste des sites de formations depuis le serveur',
          titleConstants.error.server);
      });
    })));

  it('should not get locations and display error message', async(inject([LocationService, MockBackend, AlertService],
    (locationService: LocationService, mockBackend: MockBackend, alertService: AlertService) => {
      spyOn(alertService, 'defaultErrorMsg');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        const error = new Error('test');
        error['status'] = 400;
        conn.mockError(error);
      });
      locationService.findAll().subscribe(res => fail('should fail'), () => {
        expect(alertService.defaultErrorMsg).toHaveBeenCalled();
      });
    })));

});
