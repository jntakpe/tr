import {TestBed, async, inject} from '@angular/core/testing';
import {HttpModule, BaseRequestOptions, Http, ResponseOptions, Response} from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {TableModule} from '../../shared/table/table.module';
import {ModalModule} from '../../shared/components/modal.module';
import {RouterModule} from '@angular/router';
import {SecurityService} from '../../security/security.service';
import {AuthHttp} from '../../security/auth.http';
import {AlertService} from '../../shared/alert.service';
import {NavigationService} from '../../shared/navigation.service';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {MockSecurityService} from '../../shared/test/test-utils';
import {SessionService} from './session.service';
import {PaginationService} from '../../shared/pagination/pagination.service';
import {PageRequest} from '../../shared/pagination/page-request';
import {TableOptions} from 'angular2-data-table';
import {Page} from '../../shared/pagination/page';
import {Session} from '../../session/session';
describe('session service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
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
  });


  it('should find some sessions', async(inject([SessionService, MockBackend, AlertService],
    (sessionService: SessionService, mockBackend: MockBackend, alertService: AlertService) => {
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

  function createFakeResponse() {
    return {
      totalPages: 1,
      totalElements: 3,
      first: true,
      last: false,
      size: 10,
      numberOfElements: 3,
      number: 0,
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

});
