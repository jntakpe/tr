import {Injectable, TemplateRef} from '@angular/core';
import {Observable} from 'rxjs';
import {Location} from './location';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup} from '@angular/forms';
import {Response} from '@angular/http';

@Injectable()
export class LocationService {

  constructor(private authHttp: AuthHttp, private alertService: AlertService, private ngbModal: NgbModal) {
  }

  findAll(): Observable<Location[]> {
    return this.authHttp.get('api/locations').map(res => res.json()).catch((err, caught) => {
      if (err.status === 500) {
        this.alertService.error('Impossible de récupérer la liste des sites de formations depuis le serveur', titleConstants.error.server);
      } else {
        this.alertService.defaultErrorMsg();
      }
      return Observable.throw(caught);
    });
  }

  saveModal(modalContent: TemplateRef<any>, location: Location = new Location('', '')): Observable<Location> {
    return Observable.fromPromise(this.ngbModal.open(modalContent).result)
      .map((form: FormGroup) => new Location(form.value.name, form.value.city))
      .flatMap(l => this.save(l))
      .do((l: Location) => this.alertService.success(`Site de formation ${l.name} de ${l.city} ${location.id ? 'modifié' : 'créé'}`))
      .catch(() => Observable.empty());
  }

  private save(location: Location): Observable<Location> {
    return this.saveRequest(location)
      .map(res => res.json())
      .catch((err: Response) => {
        if (err.status === 500) {
          this.alertService.error('Impossible d\'enregistrer le site de formation', titleConstants.error.server);
        } else if (err.status === 400) {
          this.alertService.error(err.text(), titleConstants.error.badRequest);
        } else {
          this.alertService.defaultErrorMsg();
        }
        return Observable.empty();
      });
  }

  private saveRequest(location: Location): Observable<Response> {
    const body = JSON.stringify(location);
    return location.id ? this.authHttp.put('api/locations', body) : this.authHttp.post('api/locations', body);
  }
}
