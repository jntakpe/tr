import { Injectable } from '@angular/core';
import { AuthHttp } from '../../security/auth.http';
import { AlertService, titleConstants } from '../../shared/alert.service';
import { FilterTableService } from '../../shared/table/filter-table.service';
import { Trainer } from './trainer';
import { Observable } from 'rxjs/Observable';
import '../../shared/rxjs.extension';
import { SelectEntry } from '../../shared/select-entry';

@Injectable()
export class TrainerService {

  constructor(private authHttp: AuthHttp,
              private alertService: AlertService,
              private filterTableService: FilterTableService) {
  }

  findAll(): Observable<Trainer[]> {
    return this.authHttp.get('api/trainers').map(res => res.json()).catch(err => {
      if (err.status === 500) {
        this.alertService.error('Impossible de récupérer la liste des formateurs depuis le serveur', titleConstants.error.server);
      } else {
        this.alertService.defaultErrorMsg();
      }
      return Observable.empty();
    });
  }

  findAllTrainers(): Observable<SelectEntry[]> {
    return this.findAll().map((trainers: Trainer[]) => trainers.map(t => new SelectEntry(t.id, `${t.firstName} ${t.lastName}`)));
  }

  filterTable(trainers: Trainer[], {login, email, firstName, lastName, trainings}): Trainer[] {
    return this.filterTableService.regexFilter(trainers, {login, email, firstName, lastName, trainings});
  }

}
