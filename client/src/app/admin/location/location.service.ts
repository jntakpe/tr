import {Injectable, TemplateRef} from '@angular/core';
import {Observable} from 'rxjs';
import {Location} from './location';
import {AuthHttp} from '../../security/auth.http';
import {AlertService, titleConstants} from '../../shared/alert.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup} from '@angular/forms';
import {Response} from '@angular/http';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';
import {ConstraintsMessage} from '../../shared/constraint';
import {FilterService} from '../../shared/table/filter.service';

@Injectable()
export class LocationService {

  constructor(private authHttp: AuthHttp,
              private alertService: AlertService,
              private ngbModal: NgbModal,
              private filterService: FilterService) {
  }

  findAll(): Observable<Location[]> {
    return this.authHttp.get('api/locations').map(res => res.json()).catch((err, caught) => { // TODO remove useless param
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
      .map((form: FormGroup) => new Location(form.value.name, form.value.city, location.id))
      .flatMap(l => this.save(l))
      .flatMap(() => this.findAll())
      .catch(() => Observable.empty());
  }

  removeModal(modalInstance: ConfirmModalComponent, location: Location): Observable<Location[]> {
    return this.removeMessage(location)
      .flatMap(c => modalInstance.open(c, 'Suppression d\'un site de formation'))
      .flatMap(() => this.remove(location))
      .flatMap(() => this.findAll())
      .catch(() => Observable.empty());
  }

  filterTable(locations: Location[], {name, city}): Location[] {
    return this.filterService.regexFilter(locations, {name, city});
  }

  private save(location: Location): Observable<Location> {
    return this.saveRequest(location)
      .map(res => res.json())
      .do((l: Location) => this.alertService.success(`Le site de formation ${l.name} de ${l.city} a été ${l.id ? 'modifié' : 'créé'}`))
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
    return location.id ? this.authHttp.put(`api/locations/${location.id}`, body) : this.authHttp.post('api/locations', body);
  }

  private remove(location: Location): Observable<Response> {
    return this.authHttp.delete(`api/locations/${location.id}`)
      .do(() => this.alertService.success(`La suppression du site de formation ${location.name} de ${location.city} effectuée`))
      .catch(() => {
        this.alertService.error(`Impossible de supprimer le site de formation ${location.name} de ${location.city}`,
          titleConstants.error.server);
        return Observable.empty();
      });
  }

  private removeMessage(location: Location): Observable<ConstraintsMessage> {
    return this.authHttp.get(`api/locations/${location.id}/constraints`)
      .map(res => {
        const siteMsg = `le site de formation ${location.name} de ${location.city}`;
        if (res.status === 204) {
          return new ConstraintsMessage(`Êtes-vous sûr de vouloir supprimer ${siteMsg} ?`);
        }
        const constraints = res.json();
        const msg = `Impossible de supprimer ${siteMsg} car il est utilisé par ${constraints.length > 1 ? 'les sessions' : 'la session'} :`;
        return new ConstraintsMessage(msg, constraints);
      });
  }

}
