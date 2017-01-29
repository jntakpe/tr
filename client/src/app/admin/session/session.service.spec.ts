import { TestBed, async, inject, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { HttpModule, BaseRequestOptions, Http, ResponseOptions, Response, RequestMethod } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TableModule } from '../../shared/table/table.module';
import { ModalModule } from '../../shared/components/modal.module';
import { RouterModule } from '@angular/router';
import { SecurityService } from '../../security/security.service';
import { AuthHttp } from '../../security/auth.http';
import { AlertService, titleConstants } from '../../shared/alert.service';
import { NavigationService } from '../../shared/navigation.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MockSecurityService } from '../../shared/test/test-utils';
import { SessionService } from './session.service';
import { PaginationService } from '../../shared/pagination/pagination.service';
import { PageRequest } from '../../shared/pagination/page-request';
import { Page } from '../../shared/pagination/page';
import { Session } from '../../session/session';
import { Component } from '@angular/core/src/metadata/directives';
import { ViewChild } from '@angular/core/src/metadata/di';
import { Employee } from '../../shared/employee';
import { Training } from '../training/training';
import { Location } from '../location/location';
import { TrainingService } from '../training/training.service';
import { TrainingModule } from '../training/training.module';
import { DomainService } from '../../shared/domain/domain.service';
import { PageContext } from '../../shared/pagination/page-context';

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
      imports: [TrainingModule, HttpModule, ReactiveFormsModule, RouterTestingModule, TableModule, ModalModule, RouterModule.forChild([])],
      providers: [
        SessionService,
        PaginationService,
        DomainService,
        AuthHttp,
        AlertService,
        NavigationService,
        TrainingService,
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

  it('should find one session', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((conn: MockConnection) => {
        conn.mockRespond(new Response(new ResponseOptions({
          body: new Session(
            '2016-10-04',
            new Location('colo1', 'Toulouse'),
            new Employee('jntakpe', 'jntakpe@mail.com', 'Jocelyn', 'Ntakpe', null, null),
            new Training('AngularJS', 3, 'Technologies')
          )
        })));
      });
      sessionService.findSession(1).subscribe((session: Session) => {
        expect(session).toBeTruthy();
        expect(session.start).toBeTruthy();
        expect(session.location).toBeTruthy();
        expect(session.location.name).toBe('colo1');
        expect(session.trainer).toBeTruthy();
        expect(session.trainer.login).toBe('jntakpe');
        expect(session.training).toBeTruthy();
        expect(session.training.name).toBe('AngularJS');
      }, err => fail('error session response'));
    })));

  it('should find one session and convert date', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((conn: MockConnection) => {
        conn.mockRespond(new Response(new ResponseOptions({
          body: new Session(
            '2016-10-04',
            new Location('colo1', 'Toulouse'),
            new Employee('jntakpe', 'jntakpe@mail.com', 'Jocelyn', 'Ntakpe', null, null),
            new Training('AngularJS', 3, 'Technologies')
          )
        })));
      });
      sessionService.findSession(1).subscribe((session: Session) => {
        expect(session).toBeTruthy();
        expect(session.start).toBeTruthy();
        expect(session.start.year).toBe(2016);
        expect(session.start.month).toBe(10);
        expect(session.start.day).toBe(4);
      }, err => fail('error session response'));
    })));

  it('should find one session and convert date first day', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((conn: MockConnection) => {
        conn.mockRespond(new Response(new ResponseOptions({
          body: new Session(
            '2016-01-01',
            new Location('colo1', 'Toulouse'),
            new Employee('jntakpe', 'jntakpe@mail.com', 'Jocelyn', 'Ntakpe', null, null),
            new Training('AngularJS', 3, 'Technologies')
          )
        })));
      });
      sessionService.findSession(1).subscribe((session: Session) => {
        expect(session).toBeTruthy();
        expect(session.start).toBeTruthy();
        expect(session.start.year).toBe(2016);
        expect(session.start.month).toBe(1);
        expect(session.start.day).toBe(1);
      }, err => fail('error session response'));
    })));

  it('should find one session and convert date last day', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((conn: MockConnection) => {
        conn.mockRespond(new Response(new ResponseOptions({
          body: new Session(
            '2016-12-31',
            new Location('colo1', 'Toulouse'),
            new Employee('jntakpe', 'jntakpe@mail.com', 'Jocelyn', 'Ntakpe', null, null),
            new Training('AngularJS', 3, 'Technologies')
          )
        })));
      });
      sessionService.findSession(1).subscribe((session: Session) => {
        expect(session).toBeTruthy();
        expect(session.start).toBeTruthy();
        expect(session.start.year).toBe(2016);
        expect(session.start.month).toBe(12);
        expect(session.start.day).toBe(31);
      }, err => fail('error session response'));
    })));

  it('should find some sessions', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((conn: MockConnection) => {
        conn.mockRespond(new Response(new ResponseOptions({
          body: createFakeListResponse()
        })));
      });
      sessionService.findSessions(new PageRequest<Session>(new PageContext())).subscribe((page: Page<Session>) => {
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
      sessionService.findSessions(new PageRequest<Session>(new PageContext())).subscribe(() => fail('error sessions response'), () => {
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
      sessionService.findSessions(new PageRequest<Session>(new PageContext())).subscribe(() => fail('error sessions response'), () => {
        expect(alertService.defaultErrorMsg).toHaveBeenCalled();
      });
    })));

  it('should find some sessions and reindex content', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend) => {
      mockBackend.connections.subscribe((conn: MockConnection) => {
        conn.mockRespond(new Response(new ResponseOptions({
          body: createFakeListResponse(1, 13)
        })));
      });
      sessionService.findSessions(new PageRequest<Session>(new PageContext())).subscribe((page: Page<Session>) => {
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
            body: createFakeListResponse()
          })));
        }
      });
      sessionService.removeModal(fixture.componentInstance.confirmModal, createSession(), new PageRequest<Session>(new PageContext()))
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
            body: createFakeListResponse()
          })));
        }
      });
      sessionService.removeModal(fixture.componentInstance.confirmModal, createSession(), new PageRequest<Session>(new PageContext()))
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
            body: createFakeListResponse()
          })));
        }
      });
      sessionService.removeModal(fixture.componentInstance.confirmModal, createSession(), new PageRequest<Session>(new PageContext()))
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

  function createSession(): Session {
    const start = '2016-11-10';
    const location = new Location('Triangle', 'Paris');
    const trainer = new Employee(null, null, 'Jocelyn', 'NTAKPE', null, null);
    const training = new Training('AngularJS', null, 'Technologies');
    return new Session(start, location, trainer, training);
  }

});

export function createFakeListResponse(number = 0, totalElements = 3): Page<Session> {
  const content = [
    new Session(
      '2016-10-04',
      new Location('colo1', 'Toulouse'),
      new Employee('jntakpe', 'jntakpe@mail.com', 'Jocelyn', 'Ntakpe', null, null),
      new Training('AngularJS', 3, 'Technologies')
    ),
    new Session(
      '2016-10-04',
      new Location('triangle', 'Paris'),
      new Employee('gpeel', 'gauthier.peel@mail.com', 'Gauthier', 'Peel', null, null),
      new Training('Hibernate', 3, 'Technologies')
    ),
    new Session(
      '2015-11-04',
      new Location('matei', 'Paris'),
      new Employee('gpeel', 'gauthier.peel@mail.com', 'Gauthier', 'Peel', null, null),
      new Training('Spring', 3, 'Technologies')
    )
  ];
  return new Page(content, 1, totalElements, true, false, 10, 3, null, number);
}
