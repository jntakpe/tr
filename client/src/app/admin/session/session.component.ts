import {Component, OnInit, OnDestroy} from '@angular/core';
import {SessionService} from './session.service';
import {Subscription} from 'rxjs';
import {Session} from '../../session/session';
import {TableOptions, ColumnMode, TableColumn} from 'angular2-data-table';
import {PageRequest} from '../../shared/pagination/page-request';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'session-component',
  template: require('./session.component.html')
})
export class SessionComponent implements OnInit, OnDestroy {

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

  changePage({offset, limit}) {
    this.updateSessions(new PageRequest(new Session('', null, null, null), offset, limit));
  }

  private updateSessions(pageRequest: PageRequest<Session> = new PageRequest(new Session('', null, null, null), 0, this.dtOptions.limit)) {
    this.sessionSubscription = this.sessionService.findSessions(pageRequest).subscribe(page => {
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
        new TableColumn({name: 'Début', prop: 'start'}),
        new TableColumn({name: 'Domaine', prop: 'training.domain'}),
        new TableColumn({name: 'Formation', prop: 'training.name'}),
        new TableColumn({name: 'Ville', prop: 'location.city'}),
        new TableColumn({name: 'Site', prop: 'location.name'}),
        new TableColumn({name: 'Prénom du formateur', prop: 'trainer.firstName'}),
        new TableColumn({name: 'Nom du formateur', prop: 'trainer.lastName'})
        // new TableColumn({name: 'Modifier', template: this.editRowTmpl, sortable: false, canAutoResize: false}),
        // new TableColumn({name: 'Supprimer', template: this.removeRowTmpl, sortable: false, canAutoResize: false})
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
