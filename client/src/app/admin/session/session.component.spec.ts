import {TestBed, ComponentFixture, async, tick, fakeAsync} from '@angular/core/testing';
import {SessionComponent} from './session.component';
import {FormModule} from '../../shared/form/form.module';
import {TableModule} from '../../shared/table/table.module';
import {ModalModule} from '../../shared/components/modal.module';
import {SessionService} from './session.service';
import {FormService} from '../../shared/form/form.service';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {PageRequest} from '../../shared/pagination/page-request';
import {Session} from '../../session/session';
import {Observable} from 'rxjs';
import {Page} from '../../shared/pagination/page';
import {SessionSearchForm} from './session-search-form';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';
import {createFakeResponse} from './session.service.spec';
import {By} from '@angular/platform-browser';

describe('session component', () => {

  let fixture: ComponentFixture<SessionComponent>;

  class MockSessionService extends SessionService {

    findSessions(pageRequest: PageRequest<Session>): Observable<Page<Session>> {
      return Observable.of(createFakeResponse());
    }

    formToSession(formData: SessionSearchForm): Session {
      return super.formToSession(formData);
    }

    removeModal(modalInstance: ConfirmModalComponent, session: Session, pageRequest: PageRequest<Session>): Observable<Page<Session>> {
      const sessionsPage: Page<Session> = createFakeResponse();
      sessionsPage.content.pop();
      return Observable.of(sessionsPage);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionComponent],
      imports: [FormModule, TableModule, ModalModule, NgbDatepickerModule, RouterTestingModule, RouterModule.forChild([])],
      providers: [
        {provide: SessionService, useClass: MockSessionService},
        FormService
      ]
    });
    fixture = TestBed.createComponent(SessionComponent);
  });

  it('should create session component', async(() => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  }));

  it('should display sessions', fakeAsync(() => {
    fixture.detectChanges();
    const tbody = fixture.debugElement.query(By.css('.datatable .datatable-body>div>.datatable-scroll'));
    tick(10);
    fixture.detectChanges();
    expect(tbody).toBeTruthy();
    expect(tbody.children.length).toBe(3);
  }));

  it('should remove one session from table', fakeAsync(() => {
    fixture.detectChanges();
    const tbody = fixture.debugElement.query(By.css('.datatable .datatable-body>div>.datatable-scroll'));
    tick();
    fixture.detectChanges();
    expect(tbody).toBeTruthy();
    fixture.debugElement.nativeElement.querySelector('button.btn.btn-danger.btn-xs:first-child').click();
    tick();
    fixture.detectChanges();
    tick(500);
    expect(fixture.componentInstance.displayedSessions.length).toBe(2);
  }));

});
