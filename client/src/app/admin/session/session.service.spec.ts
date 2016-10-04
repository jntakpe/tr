import {TestBed, async, inject, fakeAsync, ComponentFixture, tick} from '@angular/core/testing';
import {HttpModule, BaseRequestOptions, Http, ResponseOptions, Response, RequestMethod} from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {TableModule} from '../../shared/table/table.module';
import {ModalModule} from '../../shared/components/modal.module';
import {RouterModule} from '@angular/router';
import {SecurityService} from '../../security/security.service';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';
import {NavigationService} from '../../shared/navigation.service';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {MockSecurityService} from '../../shared/test/test-utils';
import {SessionService} from './session.service';
import {PaginationService} from '../../shared/pagination/pagination.service';
import {PageRequest} from '../../shared/pagination/page-request';
import {TableOptions} from 'angular2-data-table';
import {Page} from '../../shared/pagination/page';
import {Session} from '../../session/session';
import {Component} from '@angular/core/src/metadata/directives';
import {ViewChild} from '@angular/core/src/metadata/di';
import {Employee} from '../../shared/employee';
import {Training} from '../training/training';
import {Location} from '../location/location';

describe('session service', () => {

  let fixture: ComponentFixture<ModalComponent>;

  @Component({
    selector: 'modal-cmp',
    template: `
    <template ngbModalContainer></template>
    <confirm-modal #confirmModal></confirm-modal>
  `
  })
  class ModalComponent {

    @ViewChild('confirmModal') confirmModal;

    constructor() {
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule, TableModule, ModalModule, RouterModule.forChild([])],
      providers: [
        SessionService,
        PaginationService,
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


  it('should find some sessions', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((conn: MockConnection) => {
        conn.mockRespond(new Response(new ResponseOptions({
          body: createFakeResponse()
        })));
      });
      sessionService.findSessions(new PageRequest<Session>(new TableOptions({}))).subscribe((page: Page<Session>) => {
        expect(page).toBeTruthy();
        expect(page.content.length).toBe(3);
        expect(page.content[0].location.name).toBe('colo1');
      }, err => fail('error sessions response'));
    })));

  it('should not find sessions and display error message', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend, alertService: AlertService) => {
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        const error = new Error('test');
        error['status'] = 500;
        conn.mockError(error);
      });
      sessionService.findSessions(new PageRequest<Session>(new TableOptions({}))).subscribe(() => fail('error sessions response'), () => {
        expect(alertService.error).toHaveBeenCalledWith('Impossible de récupérer la liste des sessions depuis le serveur',
          titleConstants.error.server);
      });
    })));

  it('should not find sessions and display default error message', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend, alertService: AlertService) => {
      spyOn(alertService, 'defaultErrorMsg');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        const error = new Error('test');
        error['status'] = 400;
        conn.mockError(error);
      });
      sessionService.findSessions(new PageRequest<Session>(new TableOptions({}))).subscribe(() => fail('error sessions response'), () => {
        expect(alertService.defaultErrorMsg).toHaveBeenCalled();
      });
    })));

  it('should find some sessions and reindex content', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((conn: MockConnection) => {
        conn.mockRespond(new Response(new ResponseOptions({
          body: createFakeResponse(1, 13)
        })));
      });
      sessionService.findSessions(new PageRequest<Session>(new TableOptions({}))).subscribe((page: Page<Session>) => {
        expect(page).toBeTruthy();
        expect(page.content.length).toBe(13);
        expect(page.content[0]).toBeFalsy();
        expect(page.content[10]).toBeTruthy();
        expect(page.content[10].location.name).toBe('colo1');
      }, err => fail('error sessions response'));
    })));

  it('should transform form data into session', inject([SessionService], (sessionService: SessionService) => {
    const start = {
      year: 2016,
      month: 10,
      day: 15
    };
    const trainingName = 'Angular';
    const trainingDomain = 'Technologies';
    const locationName = 'Triangle';
    const locationCity = 'Paris';
    const firstName = 'Jocelyn';
    const lastName = 'NTAKPE';
    const session = sessionService.formToSession({
      start,
      trainingName,
      trainingDomain,
      locationName,
      locationCity,
      firstName,
      lastName
    });
    expect(session).toBeTruthy();
    expect(session.start).toBe('2016-10-15');
    expect(session.location).toBeTruthy();
    expect(session.location.name).toBe(locationName);
    expect(session.location.city).toBe(locationCity);
    expect(session.training).toBeTruthy();
    expect(session.training.name).toBe(trainingName);
    expect(session.training.domain).toBe(trainingDomain);
    expect(session.trainer).toBeTruthy();
    expect(session.trainer.firstName).toBe(firstName);
    expect(session.trainer.lastName).toBe(lastName);
  }));

  it('should transform form data even if no data', inject([SessionService], (sessionService: SessionService) => {
    const session = sessionService.formToSession({
      start: null,
      trainingName: null,
      trainingDomain: null,
      locationName: null,
      locationCity: null,
      firstName: null,
      lastName: null
    });
    expect(session).toBeTruthy();
  }));

  it('should remove one session from table', fakeAsync(inject([MockBackend, SessionService, AlertService],
    (mockBackend: MockBackend, sessionService: SessionService, alertService: AlertService) => {
      let pageSession: Page<Session> = null;
      let deleteCalled = false;
      let getCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Delete) {
          deleteCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            status: 200
          })));
        } else if (conn.request.method === RequestMethod.Get) {
          getCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: createFakeResponse()
          })));
        }
      });
      sessionService.removeModal(fixture.componentInstance.confirmModal, createSession(), new PageRequest<Session>(new TableOptions({})))
        .subscribe(page => pageSession = page, err => fail('should empty'));
      fixture.detectChanges();
      tick();
      fixture.debugElement.nativeElement.querySelector('button#confirm-btn').click();
      fixture.detectChanges();
      tick();
      expect(pageSession).toBeTruthy();
      expect(pageSession.content).toBeTruthy();
      expect(deleteCalled).toBeTruthy();
      expect(getCalled).toBeTruthy();
      expect(alertService.success).toHaveBeenCalledWith('La suppression de la session AngularJS du 2016-11-10 effectuée');
    })));

  it('should fail removing one session from table', fakeAsync(inject([MockBackend, SessionService, AlertService],
    (mockBackend: MockBackend, sessionService: SessionService, alertService: AlertService) => {
      let deleteCalled = false;
      let getCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Delete) {
          deleteCalled = true;
          const error = new Error();
          error['status'] = 500;
          conn.mockError(error);
        } else if (conn.request.method === RequestMethod.Get) {
          getCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: createFakeResponse()
          })));
        }
      });
      sessionService.removeModal(fixture.componentInstance.confirmModal, createSession(), new PageRequest<Session>(new TableOptions({})))
        .subscribe(() => fail('should fail'), () => fail('should empty'));
      fixture.detectChanges();
      tick();
      fixture.debugElement.nativeElement.querySelector('button#confirm-btn').click();
      fixture.detectChanges();
      tick();
      expect(deleteCalled).toBeTruthy();
      expect(getCalled).toBeFalsy();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Impossible de supprimer la session AngularJS du 2016-11-10',
        titleConstants.error.server);
    })));

  it('should fail removing one session from table', fakeAsync(inject([MockBackend, SessionService, AlertService],
    (mockBackend: MockBackend, sessionService: SessionService, alertService: AlertService) => {
      let deleteCalled = false;
      let getCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Delete) {
          deleteCalled = true;
          const error = new Error();
          error['status'] = 500;
          conn.mockError(error);
        } else if (conn.request.method === RequestMethod.Get) {
          getCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: createFakeResponse()
          })));
        }
      });
      sessionService.removeModal(fixture.componentInstance.confirmModal, createSession(), new PageRequest<Session>(new TableOptions({})))
        .subscribe(() => fail('should fail'), () => fail('should empty'));
      fixture.detectChanges();
      tick();
      fixture.debugElement.nativeElement.querySelector('button#confirm-btn').click();
      fixture.detectChanges();
      tick();
      expect(deleteCalled).toBeTruthy();
      expect(getCalled).toBeFalsy();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Impossible de supprimer la session AngularJS du 2016-11-10',
        titleConstants.error.server);
    })));

  function createFakeResponse(number = 0, totalElements = 3) {
    return {
      totalPages: 1,
      totalElements,
      first: true,
      last: false,
      size: 10,
      numberOfElements: 3,
      number,
      content: [
        {
          start: '2016-10-04',
          location: {name: 'colo1', city: 'Toulouse'},
          training: {name: 'AngularJS', duration: 3, domain: 'Technologies'},
          trainer: {login: 'jntakpe', email: 'jocelyn.ntakpe@mail.com', firstName: 'Jocelyn', lastName: 'Ntakpé'}
        },
        {
          start: '2016-10-04',
          location: {name: 'triangle', city: 'Paris'},
          training: {name: 'Hibernate', duration: 3, domain: 'Technologies'},
          trainer: {login: 'gpeel', email: 'gauthier.peel@mail.com', firstName: 'Gauthier', lastName: 'Peel'}
        },
        {
          start: '2015-11-04',
          location: {name: 'matei', city: 'Paris'},
          training: {name: 'Spring', duration: 3, domain: 'Technologies'},
          trainer: {login: 'gpeel', email: 'gauthier.peel@mail.com', firstName: 'Gauthier', lastName: 'Peel'}
        }
      ]
    };
  }

  function createSession(): Session {
    const start = '2016-11-10';
    const location = new Location('Triangle', 'Paris');
    const trainer = new Employee(null, null, 'Jocelyn', 'NTAKPE', null, null);
    const training = new Training('AngularJS', null, 'Technologies');
    return new Session(start, location, trainer, training);
  }

});
