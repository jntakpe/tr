import {Component, OnInit, OnDestroy, TemplateRef} from '@angular/core';
import {SessionService} from './session.service';
import {Subscription} from 'rxjs';
import {Session} from '../../session/session';
import {TableOptions, ColumnMode, TableColumn} from 'angular2-data-table';
import {PageRequest} from '../../shared/pagination/page-request';
import {FormGroup} from '@angular/forms';
import {ViewChild} from '@angular/core/src/metadata/di';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';

@Component({
  selector: 'session-component',
  template: require('./session.component.html')
})
export class SessionComponent implements OnInit, OnDestroy {

  @ViewChild('editRowTmpl') editRowTmpl: TemplateRef<any>;

  @ViewChild('removeRowTmpl') removeRowTmpl: TemplateRef<any>;

  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  displayedSessions: Session[] = [];

  sessionSubscription: Subscription;

  dtOptions: TableOptions;

  searchForm: FormGroup;

  private _sessions: Session[] = [];

  constructor(private sessionService: SessionService) {
  }

  ngOnInit() {
    this.dtOptions = this.buildTableOptions();
    this.updateSessions();
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
  }

  initSearchForm() {

  }

  changePage() {
    this.updateSessions();
  }

  sortColumn() {
    this.updateSessions();
  }

  private updateSessions() {
    this.sessionSubscription = this.sessionService.findSessions(new PageRequest<Session>(this.dtOptions)).subscribe(page => {
      this.dtOptions.count = page.totalElements;
      this.sessions = page.content;
    });
  }

  private buildTableOptions(): TableOptions {
    return new TableOptions({
      externalPaging: true,
      reorderable: false,
      footerHeight: 50,
      columnMode: ColumnMode.force,
      rowHeight: 'auto',
      limit: 10,
      columns: [
        new TableColumn({name: 'Début', prop: 'start', width: 100}),
        new TableColumn({name: 'Domaine', prop: 'training.domain', width: 140}),
        new TableColumn({name: 'Formation', prop: 'training.name', width: 140}),
        new TableColumn({name: 'Ville', prop: 'location.city', width: 100}),
        new TableColumn({name: 'Site', prop: 'location.name', width: 100}),
        new TableColumn({name: 'Prénom', prop: 'trainer.firstName', width: 100}),
        new TableColumn({name: 'Nom', prop: 'trainer.lastName', width: 100}),
        new TableColumn({name: 'Modifier', template: this.editRowTmpl, sortable: false, canAutoResize: false, width: 80}),
        new TableColumn({name: 'Supprimer', template: this.removeRowTmpl, sortable: false, canAutoResize: false, width: 90})
      ]
    });
  }

  set sessions(sessions: Session[]) {
    this._sessions = sessions;
    this.displayedSessions = sessions;
    this.initSearchForm();
  }

  get sessions() {
    return this._sessions;
  }

}
