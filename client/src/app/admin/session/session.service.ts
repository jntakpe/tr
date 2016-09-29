import {Injectable} from '@angular/core';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FilterTableService} from '../../shared/table/filter-table.service';
import {PageRequest} from '../../shared/pagination/page-request';
import {Session} from '../../session/session';
import {Observable} from 'rxjs';

@Injectable()
export class SessionService {

  constructor(private authHttp: AuthHttp,
              private alertService: AlertService,
              private ngbModal: NgbModal,
              private filterTableService: FilterTableService) {
  }

  findSessions(pageRequest: PageRequest = new PageRequest(), session?: Session): Observable<Session[]> {
    return this.authHttp.get('api/sessions').map(res => res.json()).map(page => page.content).catch(err => {
      if (err.status === 500) {
        this.alertService.error('Impossible de récupérer la liste des sessions depuis le serveur', titleConstants.error.server);
      } else {
        this.alertService.defaultErrorMsg();
      }
      return Observable.empty();
    });
  }

}
