import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Location} from './location';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';

@Injectable()
export class LocationService {

  constructor(private authHttp: AuthHttp, private alertService: AlertService) {
  }

  findAll(): Observable<Location> {
    return this.authHttp.get('api/locations').map(res => res.json()).catch((err, caught) => {
      if (err.status === 500) {
        this.alertService.error('Impossible de récupérer la liste des sites de formations depuis le serveur', titleConstants.error.server);
      } else {
        this.alertService.defaultErrorMsg();
      }
      return Observable.throw(caught);
    });
  }

}
