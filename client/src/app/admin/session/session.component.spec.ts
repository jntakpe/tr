import { TestBed, ComponentFixture, async, tick, fakeAsync } from '@angular/core/testing';
import { SessionComponent } from './session.component';
import { FormModule } from '../../shared/form/form.module';
import { TableModule } from '../../shared/table/table.module';
import { SessionService } from './session.service';
import { FormService } from '../../shared/form/form.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { PageRequest } from '../../shared/pagination/page-request';
import { Session } from '../../session/session';
import { Observable } from 'rxjs/Observable';
import { Page } from '../../shared/pagination/page';
import { SessionSearchForm } from './session-search-form';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { createFakeListResponse } from './session.service.spec';
import { By } from '@angular/platform-browser';
import { DomainService } from '../../shared/domain/domain.service';

describe('session component', () => {

  let fixture: ComponentFixture<SessionComponent>;

  class MockSessionService extends SessionService {

    constructor() {
      super(null, null, null, null);
    }

    findSessions(pageRequest: PageRequest<Session>): Observable<Page<Session>> {
      return Observable.of(createFakeListResponse());
    }

    formToSession(formData: SessionSearchForm): Session {
      return super.formToSession(formData);
    }

    removeModal(modalInstance: ConfirmModalComponent, session: Session, pageRequest: PageRequest<Session>): Observable<Page<Session>> {
      const sessionsPage: Page<Session> = createFakeListResponse();
      sessionsPage.content.pop();
      return Observable.of(sessionsPage);
    }
  }

  class MockDomainService extends DomainService {

    constructor() {
      super(null);
    }

    findAll(): Observable<string[]> {
      return Observable.of(['MockDomain 1', 'MockDomain 2']);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionComponent, ConfirmModalComponent],
      imports: [FormModule, TableModule, NgbModule.forRoot(), RouterTestingModule, RouterModule.forChild([])],
      providers: [
        {provide: SessionService, useClass: MockSessionService},
        {provide: DomainService, useClass: MockDomainService},
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
    const tbody = fixture.debugElement.query(By.css('.ngx-datatable .datatable-body .datatable-scroll'));
    tick(10);
    fixture.detectChanges();
    expect(tbody).toBeTruthy();
    expect(tbody.children.length).toBe(3);
  }));

  it('should remove one session from table', fakeAsync(() => {
    fixture.detectChanges();
    const tbody = fixture.debugElement.query(By.css('.ngx-datatable .datatable-body .datatable-scroll'));
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
