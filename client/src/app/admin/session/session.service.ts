import {Injectable} from '@angular/core';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FilterTableService} from '../../shared/table/filter-table.service';
import {PageRequest} from '../../shared/pagination/page-request';
import {Session} from '../../session/session';
import {Observable} from 'rxjs';
import {Page} from '../../shared/pagination/page';
import {PaginationService} from '../../shared/pagination/pagination.service';
import {SessionSearchForm} from './session-search-form';
import {Location} from '../location/location';
import {Training} from '../training/training';
import {Employee} from '../../shared/employee';

@Injectable()
export class SessionService {

  constructor(private authHttp: AuthHttp,
              private alertService: AlertService,
              private paginationService: PaginationService,
              private ngbModal: NgbModal,
              private filterTableService: FilterTableService) {
  }

  findSessions(pageRequest: PageRequest<Session>): Observable<Page<Session>> {
    return this.authHttp.get('api/sessions', {search: pageRequest.toUrlSearchParams()})
      .map(res => res.json())
      .map(page => this.paginationService.reIndexContent(page))
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
    const location = new Location(formData.locationName, formData.locationCity);
    const trainer = new Employee(null, null, formData.firstName, formData.lastName, null, null);
    const training = new Training(formData.trainingName, null, formData.trainingDomain);
    return new Session(formData.start, location, trainer, training);
  }

}
