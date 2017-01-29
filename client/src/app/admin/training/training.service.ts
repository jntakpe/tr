import { Injectable, TemplateRef } from '@angular/core';
import { AuthHttp } from '../../security/auth.http';
import { AlertService, titleConstants } from '../../shared/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterTableService } from '../../shared/table/filter-table.service';
import { Observable } from 'rxjs/Observable';
import '../../shared/rxjs.extension';
import { Training } from './training';
import { FormGroup } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { Response } from '@angular/http';
import { ConstraintsMessage } from '../../shared/constraint';
import { SelectEntry } from '../../shared/select-entry';

@Injectable()
export class TrainingService {

  constructor(private authHttp: AuthHttp,
              private alertService: AlertService,
              private ngbModal: NgbModal,
              private filterTableService: FilterTableService) {
  }

  findAll(): Observable<Training[]> {
    return this.authHttp.get('api/trainings').map(res => res.json()).catch(err => {
      if (err.status === 500) {
        this.alertService.error('Impossible de récupérer la liste des formations depuis le serveur', titleConstants.error.server);
      } else {
        this.alertService.defaultErrorMsg();
      }
      return Observable.empty();
    });
  }

  findAllTrainings(): Observable<SelectEntry[]> {
    return this.findAll().map((trainings: Training[]) => trainings.map(t => new SelectEntry(t.id, t.name)));
  }

  saveModal(modalContent: TemplateRef<any>, training: Training = Training.EMPTY_TRAINING): Observable<Training[]> {
    return Observable.fromPromise(this.ngbModal.open(modalContent).result)
      .map((form: FormGroup) => new Training(form.value.name, form.value.duration, form.value.domain, training.id))
      .mergeMap(l => this.save(l))
      .mergeMap(() => this.findAll())
      .catch(() => Observable.empty());
  }

  removeModal(modalInstance: ConfirmModalComponent, training: Training): Observable<Training[]> {
    return this.removeMessage(training)
      .mergeMap(c => modalInstance.open(c, 'Suppression d\'une formation'))
      .mergeMap(() => this.remove(training))
      .mergeMap(() => this.findAll())
      .catch(() => Observable.empty());
  }

  filterTable(trainings: Training[], {name, duration, domain}): Training[] {
    return this.filterTableService.regexFilter(trainings, {name, duration, domain});
  }

  private save(training: Training): Observable<Training> {
    return this.saveRequest(training)
      .map(res => res.json())
      .do((t: Training) => this.alertService
        .success(`La ${this.trainingLabel(training)} a été ${training.id ? 'modifiée' : 'créée'}`))
      .catch((err: Response) => {
        if (err.status === 500) {
          this.alertService.error('Impossible d\'enregistrer la formation', titleConstants.error.server);
        } else if (err.status === 400) {
          this.alertService.error(err.text(), titleConstants.error.badRequest);
        } else {
          this.alertService.defaultErrorMsg();
        }
        return Observable.empty();
      });
  }

  private saveRequest(training: Training): Observable<Response> {
    const body = JSON.stringify(training);
    return training.id ? this.authHttp.put(`api/trainings/${training.id}`, body) : this.authHttp.post('api/trainings', body);
  }

  private remove(training: Training): Observable<Response> {
    return this.authHttp.delete(`api/trainings/${training.id}`)
      .do(() => this.alertService.success(`La suppression de la ${this.trainingLabel(training)} effectuée`))
      .catch(() => {
        this.alertService.error(`Impossible de supprimer la ${this.trainingLabel(training)}`,
          titleConstants.error.server);
        return Observable.empty();
      });
  }

  private removeMessage(training: Training): Observable<ConstraintsMessage> {
    return this.authHttp.get(`api/trainings/${training.id}/constraints`)
      .map(res => {
        const siteMsg = `la ${this.trainingLabel(training)}`;
        if (res.status === 204) {
          return new ConstraintsMessage(`Êtes-vous sûr de vouloir supprimer ${siteMsg} ?`);
        }
        const constraints = res.json();
        const sessionText = constraints.length > 1 ? 'les sessions' : 'la session';
        const msg = `Impossible de supprimer ${siteMsg} car elle est utilisée par ${sessionText} :`;
        return new ConstraintsMessage(msg, constraints);
      });
  }

  private trainingLabel({name, domain}: Training): string {
    return `formation ${name} du domaine ${domain}`;
  }

}
