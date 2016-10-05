import {TestBed, ComponentFixture, async} from '@angular/core/testing';
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
      return super.removeModal(modalInstance, session, pageRequest);
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

});
