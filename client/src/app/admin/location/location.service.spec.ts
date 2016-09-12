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
import {Component, ViewChild, OnInit} from '@angular/core';
import {Location} from './location';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {ComponentFixture} from '@angular/core/testing/component_fixture';
import {SecurityService} from '../../security/security.service';
import {tick, fakeAsync} from '@angular/core/testing/fake_async';
import {FormGroup, Validators, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';
import {Angular2DataTableModule} from 'angular2-data-table';

describe('location service', () => {

  let fixture: ComponentFixture<ModalComponent>;

  @Component({
    selector: 'modal-cmp',
    template: `
    <template ngbModalContainer></template>
    <template #addContent let-close="close"><button id="close-add" (click)="close(locationForm)">Add modal</button></template>
    <confirm-modal #confirmModal></confirm-modal>
  `
  })
  class ModalComponent implements OnInit {

    @ViewChild('addContent') addModalContent;
    @ViewChild('confirmModal') confirmModal;

    saveForm: FormGroup;

    location: Location = new Location('Matei', 'Paris', 1);

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
      this.saveForm = this.formBuilder.group({
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
      declarations: [ModalComponent, ConfirmModalComponent],
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule, Angular2DataTableModule, NgbModalModule, RouterModule.forChild([])],
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
      let locations = [];
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
      locationService.saveModal(fixture.componentInstance.addModalContent, new Location('Triangle', 'Paris'))
        .subscribe(l => locations = l, err => fail('should save'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(locations.length).toBe(2);
      expect(postCalled).toBeTruthy();
      expect(getCalled).toBeTruthy();
      expect(alertService.success).toHaveBeenCalledWith('Le site de formation Triangle de Paris a été créé');
    })));

  it('should edit location and refresh', fakeAsync(inject([MockBackend, LocationService, AlertService],
    (mockBackend: MockBackend, locationService: LocationService, alertService: AlertService) => {
      let locations = [];
      let putCalled = false;
      let getCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Put) {
          putCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: {
              city: 'Paris',
              name: 'Triangle'
            },
            status: 200
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
      locationService.saveModal(fixture.componentInstance.addModalContent, new Location('Triangle', 'Paris', 1))
        .subscribe(l => locations = l, err => fail('should save'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(locations.length).toBe(2);
      expect(putCalled).toBeTruthy();
      expect(getCalled).toBeTruthy();
      expect(alertService.success).toHaveBeenCalledWith('Le site de formation Triangle de Paris a été créé');
    })));

  it('should fail creating cuz bad request', fakeAsync(inject([MockBackend, LocationService, AlertService],
    (mockBackend: MockBackend, locationService: LocationService, alertService: AlertService) => {
      let postCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Post) {
          postCalled = true;
          const error = new Error('Bad request');
          error['status'] = 400;
          error['text'] = function () {
            return this.message;
          };
          conn.mockError(error);
        }
      });
      locationService.saveModal(fixture.componentInstance.addModalContent, new Location('Triangle', 'Paris'))
        .subscribe(() => fail('should empty'), err => fail('should empty'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Bad request', titleConstants.error.badRequest);
    })));

  it('should fail creating cuz server error', fakeAsync(inject([MockBackend, LocationService, AlertService],
    (mockBackend: MockBackend, locationService: LocationService, alertService: AlertService) => {
      let postCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Post) {
          postCalled = true;
          const error = new Error('');
          error['status'] = 500;
          conn.mockError(error);
        }
      });
      locationService.saveModal(fixture.componentInstance.addModalContent, new Location('Triangle', 'Paris'))
        .subscribe(() => fail('should empty'), err => fail('should empty'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Impossible d\'enregistrer le site de formation', titleConstants.error.server);
    })));

  it('should fail creating cuz unknown error', fakeAsync(inject([MockBackend, LocationService, AlertService],
    (mockBackend: MockBackend, locationService: LocationService, alertService: AlertService) => {
      let postCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      spyOn(alertService, 'defaultErrorMsg');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Post) {
          postCalled = true;
          const error = new Error('');
          error['status'] = 405;
          conn.mockError(error);
        }
      });
      locationService.saveModal(fixture.componentInstance.addModalContent, new Location('Triangle', 'Paris'))
        .subscribe(() => fail('should empty'), err => fail('should empty'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).not.toHaveBeenCalled();
      expect(alertService.defaultErrorMsg).toHaveBeenCalled();
    })));

  it('should fail getting locations after create', fakeAsync(inject([MockBackend, LocationService, AlertService],
    (mockBackend: MockBackend, locationService: LocationService, alertService: AlertService) => {
      let postCalled = false;
      let getCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
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
          const error = new Error('');
          error['status'] = 500;
          conn.mockError(error);
        }
      });
      locationService.saveModal(fixture.componentInstance.addModalContent, new Location('Triangle', 'Paris'))
        .subscribe(() => fail('should empty'), err => fail('should empty'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(postCalled).toBeTruthy();
      expect(getCalled).toBeTruthy();
      expect(alertService.success).toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Impossible de récupérer la liste des sites de formations depuis le serveur',
        titleConstants.error.server);
    })));

  it('should remove one location from table', fakeAsync(inject([MockBackend, LocationService, AlertService],
    (mockBackend: MockBackend, locationService: LocationService, alertService: AlertService) => {
      let locations = [];
      let deleteCalled = false;
      let getCalled = false;
      let constraintCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.url.indexOf('constraints') === -1) {
          if (conn.request.method === RequestMethod.Delete) {
            deleteCalled = true;
            conn.mockRespond(new Response(new ResponseOptions({
              status: 200
            })));
          } else if (conn.request.method === RequestMethod.Get) {
            getCalled = true;
            conn.mockRespond(new Response(new ResponseOptions({
              body: [{
                city: 'Paris',
                name: 'Triangle'
              }]
            })));
          }
        } else {
          constraintCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            status: 204
          })));
        }
      });
      locationService.removeModal(fixture.componentInstance.confirmModal, new Location('Matei', 'Paris'))
        .subscribe(l => locations = l, err => fail('should empty'));
      fixture.detectChanges();
      tick();
      fixture.debugElement.nativeElement.querySelector('button#confirm-btn').click();
      fixture.detectChanges();
      tick();
      expect(locations.length).toBe(1);
      expect(constraintCalled).toBeTruthy();
      expect(deleteCalled).toBeTruthy();
      expect(getCalled).toBeTruthy();
      expect(alertService.success).toHaveBeenCalledWith('La suppression du site de formation Matei de Paris effectuée');
    })));

  it('should fail removing one location from table', fakeAsync(inject([MockBackend, LocationService, AlertService],
    (mockBackend: MockBackend, locationService: LocationService, alertService: AlertService) => {
      let locations = [];
      let deleteCalled = false;
      let getCalled = false;
      let constraintCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.url.indexOf('constraints') === -1) {
          if (conn.request.method === RequestMethod.Delete) {
            deleteCalled = true;
            const error = new Error();
            error['status'] = 500;
            conn.mockError(error);
          } else if (conn.request.method === RequestMethod.Get) {
            getCalled = true;
            conn.mockRespond(new Response(new ResponseOptions({
              body: [{
                city: 'Paris',
                name: 'Triangle'
              }]
            })));
          }
        } else {
          constraintCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            status: 204
          })));
        }
      });
      locationService.removeModal(fixture.componentInstance.confirmModal, new Location('Matei', 'Paris'))
        .subscribe(err => fail('should empty'), err => fail('should empty'));
      fixture.detectChanges();
      tick();
      fixture.debugElement.nativeElement.querySelector('button#confirm-btn').click();
      fixture.detectChanges();
      tick();
      expect(locations.length).toBe(0);
      expect(constraintCalled).toBeTruthy();
      expect(deleteCalled).toBeTruthy();
      expect(getCalled).toBeFalsy();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Impossible de supprimer le site de formation Matei de Paris',
        titleConstants.error.server);
    })));


});
