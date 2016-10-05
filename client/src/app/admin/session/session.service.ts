import {Injectable} from '@angular/core';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';
import {PageRequest} from '../../shared/pagination/page-request';
import {Session} from '../../session/session';
import {Observable} from 'rxjs';
import {Page} from '../../shared/pagination/page';
import {PaginationService} from '../../shared/pagination/pagination.service';
import {SessionSearchForm} from './session-search-form';
import {Location} from '../location/location';
import {Training} from '../training/training';
import {Employee} from '../../shared/employee';
import * as moment from 'moment';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';
import {ConstraintsMessage} from '../../shared/constraint';

@Injectable()
export class SessionService {

  constructor(private authHttp: AuthHttp,
              private alertService: AlertService,
              private paginationService: PaginationService) {
  }

  findSessions(pageRequest: PageRequest<Session>): Observable<Page<Session>> {
    return this.authHttp.get('api/sessions', {search: pageRequest.toUrlSearchParams()})
      .map(res => res.json())
      .map((page: Page<Session>) => this.paginationService.reIndexContent(page))
      .catch(err => {
        if (err.status === 500) {
          this.alertService.error('Impossible de récupérer la liste des sessions depuis le serveur', titleConstants.error.server);
        } else {
          this.alertService.defaultErrorMsg();
        }
        return Observable.empty();
      });
  }

  formToSession(formData: SessionSearchForm): Session {
    const start = formData.start &&
      moment({year: formData.start.year, month: formData.start.month - 1, day: formData.start.day}).format('YYYY-MM-DD');
    const location = new Location(formData.locationName, formData.locationCity);
    const trainer = new Employee(null, null, formData.firstName, formData.lastName, null, null);
    const training = new Training(formData.trainingName, null, formData.trainingDomain);
    return new Session(start, location, trainer, training);
  }

  removeModal(modalInstance: ConfirmModalComponent, session: Session, pageRequest: PageRequest<Session>): Observable<Page<Session>> {
    return modalInstance.open(this.removeMessage(session), 'Suppression d\'une session de formation')
      .flatMap(() => this.remove(session))
      .flatMap(() => this.findSessions(pageRequest))
      .catch(() => Observable.empty());
  }

  private remove(session: Session) {
    return this.authHttp.delete(`api/sessions/${session.id}`)
      .do(() => this.alertService.success(`La suppression de la ${this.sessionLabel(session)} effectuée`))
      .catch(() => {
        this.alertService.error(`Impossible de supprimer la ${this.sessionLabel(session)}`,
          titleConstants.error.server);
        return Observable.empty();
      });
  }

  private removeMessage(session: Session): ConstraintsMessage {
    const msg = `Êtes-vous sûr de vouloir supprimer la ${this.sessionLabel(session)} ainsi que les notes associées ?`;
    return new ConstraintsMessage(msg);
  }

  private sessionLabel(session: Session): string {
    return `session ${session.training.name} du ${session.start}`;
  }

}
