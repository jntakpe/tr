import {Injectable, TemplateRef} from '@angular/core';
import {Observable} from 'rxjs';
import {Location} from './location';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup} from '@angular/forms';
import {Response} from '@angular/http';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';

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
      return Observable.empty();
    });
  }

  saveModal(modalContent: TemplateRef<any>, location: Location = new Location('', '')): Observable<Location[]> {
    return Observable.fromPromise(this.ngbModal.open(modalContent).result)
      .map((form: FormGroup) => {
        return new Location(form.value.name, form.value.city, location.id);
      })
      .flatMap(l => this.save(l))
      .flatMap(() => this.findAll())
      .catch(() => Observable.empty());
  }

  removeModal(modalInstance: ConfirmModalComponent, location: Location): Observable<Location[]> {
    const message = `Êtes-vous sûr de vouloir supprimer le site de formation ${location.name} de ${location.city} ?`;
    return modalInstance.open(message, 'Suppression d\'un site de formation')
      .flatMap(() => this.remove(location))
      .flatMap(() => this.findAll());
  }

  private save(location: Location): Observable<Location> {
    return this.saveRequest(location)
      .map(res => res.json())
      .do((l: Location) => this.alertService.success(`Site de formation ${l.name} de ${l.city} ${location.id ? 'modifié' : 'créé'}`))
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

  private remove(location: Location): Observable<Response> {
    return this.authHttp.delete(`api/locations/${location.id}`)
      .do(() => this.alertService.success(`Suppression du site de formation ${location.name} de ${location.city} effectué`))
      .catch(() => {
        this.alertService.error(`Impossible de supprimer le site de formation ${location.name} de ${location.city}`,
          titleConstants.error.server);
        return Observable.empty();
      });
  }

  private saveRequest(location: Location): Observable<Response> {
    const body = JSON.stringify(location);
    return location.id ? this.authHttp.put(`api/locations/${location.id}`, body) : this.authHttp.post('api/locations', body);
  }

}
