import {TestBed, inject} from '@angular/core/testing/test_bed';
import {HttpModule, BaseRequestOptions, Http, Response, ResponseOptions, RequestMethod} from '@angular/http';
import {LocationService} from './location.service';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';
import {NavigationService} from '../../shared/navigation.service';
import {MockBackend, MockConnection} from '@angular/http/testing/mock_backend';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {async} from '@angular/core/testing/async';
import {Component, ViewChild} from '@angular/core';
import {Location} from './location';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {ComponentFixture} from '@angular/core/testing/component_fixture';
import {SecurityService} from '../../security/security.service';
import {fakeAsync} from '@angular/core/testing/fake_async';
import {FormGroup, Validators, FormBuilder, ReactiveFormsModule} from '@angular/forms';

describe('location service', () => {

  let fixture: ComponentFixture<ModalComponent>;

  @Component({
    selector: 'modal-cmp',
    template: `
    <template ngbModalContainer></template>
    <template #content let-close="close"><button id="close" (click)="close(locationForm)">Close modal</button></template>
  `
  })
  class ModalComponent {

    @ViewChild('content') tplContent;

    locationForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
      this.locationForm = this.formBuilder.group({
        name: ['Triangle', Validators.required],
        city: ['Paris', Validators.required]
      });
    }
  }

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
      declarations: [ModalComponent],
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule, NgbModalModule, RouterModule.forChild([])],
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
    fixture = TestBed.createComponent(ModalComponent);
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

  it('should create new location and refresh', fakeAsync(inject([MockBackend, LocationService, AlertService],
    (mockBackend: MockBackend, locationService: LocationService, alertService: AlertService) => {
      let postCalled = false;
      let getCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Post) {
          postCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: {
              city: 'Paris',
              name: 'Triangle'
            },
            status: 201
          })));
        } else if (conn.request.method === RequestMethod.Get) {
          getCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: [{
              city: 'Paris',
              name: 'Triangle'
            }, {
              city: 'Paris',
              name: 'Matei'
            }]
          })));
        }
      });
      locationService.saveModal(fixture.componentInstance.tplContent, new Location('Triangle', 'Paris'))
        .subscribe(locations => {
          expect(locations.length).toBe(2);
          expect(postCalled).toBeTruthy();
          expect(getCalled).toBeTruthy();
          expect(alertService.success).toHaveBeenCalledWith('Site de formation Triangle de Paris créé');
        }, err => fail('should save'));
      fixture.debugElement.nativeElement.querySelector('#close').click();
      fixture.detectChanges();
    })));


});
