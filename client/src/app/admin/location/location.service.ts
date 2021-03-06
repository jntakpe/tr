import { Injectable, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Location } from './location';
import { AuthHttp } from '../../security/auth.http';
import { AlertService, titleConstants } from '../../shared/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Response } from '@angular/http';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { ConstraintsMessage } from '../../shared/constraint';
import { FilterTableService } from '../../shared/table/filter-table.service';
import { SelectEntry } from '../../shared/select-entry';
import '../../shared/rxjs.extension';

@Injectable()
export class LocationService {

  constructor(private authHttp: AuthHttp,
              private alertService: AlertService,
              private ngbModal: NgbModal,
              private filterTableService: FilterTableService) {
  }

  findAll(): Observable<Location[]> {
    return this.authHttp.get('api/locations').map(res => res.json()).catch(err => {
      if (err.status === 500) {
        this.alertService.error('Impossible de récupérer la liste des sites de formations depuis le serveur', titleConstants.error.server);
      } else {
        this.alertService.defaultErrorMsg();
      }
      return Observable.empty();
    });
  }

  findAllLocations(): Observable<SelectEntry[]> {
    return this.findAll().map((locations: Location[]) => locations.map(t => new SelectEntry(t.id, t.name)));
  }

  saveModal(modalContent: TemplateRef<any>, location: Location = Location.EMPTY_LOCATION): Observable<Location[]> {
    return Observable.fromPromise(this.ngbModal.open(modalContent).result)
      .map((form: FormGroup) => new Location(form.value.name, form.value.city, location.id))
      .mergeMap(l => this.save(l))
      .mergeMap(() => this.findAll())
      .catch(() => Observable.empty());
  }

  removeModal(modalInstance: ConfirmModalComponent, location: Location): Observable<Location[]> {
    return this.removeMessage(location)
      .mergeMap(c => modalInstance.open(c, 'Suppression d\'un site de formation'))
      .mergeMap(() => this.remove(location))
      .mergeMap(() => this.findAll())
      .catch(() => Observable.empty());
  }

  filterTable(locations: Location[], {name, city}): Location[] {
    return this.filterTableService.regexFilter(locations, {name, city});
  }

  private save(location: Location): Observable<Location> {
    return this.saveRequest(location)
      .map(res => res.json())
      .do((l: Location) => this.alertService
        .success(`Le site de formation ${l.name} de ${l.city} a été ${location.id ? 'modifié' : 'créé'}`))
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
      .do(() => this.alertService.success(`La suppression du ${this.locationLabel(location)} effectuée`))
      .catch(() => {
        this.alertService.error(`Impossible de supprimer le ${this.locationLabel(location)}`,
          titleConstants.error.server);
        return Observable.empty();
      });
  }

  private removeMessage(location: Location): Observable<ConstraintsMessage> {
    return this.authHttp.get(`api/locations/${location.id}/constraints`)
      .map(res => {
        const siteMsg = `le ${this.locationLabel(location)}`;
        if (res.status === 204) {
          return new ConstraintsMessage(`Êtes-vous sûr de vouloir supprimer ${siteMsg} ?`);
        }
        const constraints = res.json();
        const msg = `Impossible de supprimer ${siteMsg} car il est utilisé par ${constraints.length > 1 ? 'les sessions' : 'la session'} :`;
        return new ConstraintsMessage(msg, constraints);
      });
  }

  private locationLabel({name, city}: Location): string {
    return `site de formation ${name} de ${city}`;
  }

}
