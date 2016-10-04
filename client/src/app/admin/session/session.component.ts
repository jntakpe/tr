import {Component, OnInit, OnDestroy, TemplateRef} from '@angular/core';
import {SessionService} from './session.service';
import {Subscription} from 'rxjs';
import {Session} from '../../session/session';
import {TableOptions, ColumnMode, TableColumn} from 'angular2-data-table';
import {PageRequest} from '../../shared/pagination/page-request';
import {FormGroup} from '@angular/forms';
import {ViewChild} from '@angular/core/src/metadata/di';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';
import {FormService} from '../../shared/form/form.service';
import {SessionSearchForm} from './session-search-form';
import {Page} from '../../shared/pagination/page';

@Component({
  selector: 'session-component',
  template: require('./session.component.html'),
  styles: [require('./session.component.scss')]
})
export class SessionComponent implements OnInit, OnDestroy {

  @ViewChild('editRowTmpl') editRowTmpl: TemplateRef<any>;

  @ViewChild('removeRowTmpl') removeRowTmpl: TemplateRef<any>;

  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  displayedSessions: Session[] = [];

  sessionSubscription: Subscription;

  dtOptions: TableOptions;

  searchForm: FormGroup;

  searchFormSubscription: Subscription;

  private _sessions: Session[] = [];

  constructor(private sessionService: SessionService, private formService: FormService) {
  }

  ngOnInit() {
    this.dtOptions = this.buildTableOptions();
    this.initSearchForm();
    this.updateSessions();
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
    this.searchFormSubscription.unsubscribe();
  }

  changePage() {
    this.updateSessions();
  }

  sortColumn() {
    this.updateSessions();
  }

  remove(session: Session) {
    this.sessionSubscription = this.sessionService.removeModal(this.confirmModal, session, this.createPageRequest())
      .subscribe(page => this.consumePage(page));
  }

  private updateSessions() {
    this.sessionSubscription = this.sessionService.findSessions(this.createPageRequest()).subscribe(page => this.consumePage(page));
  }

  private consumePage(page: Page<Session>) {
    this.dtOptions.count = page.totalElements;
    this.sessions = page.content;
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
        new TableColumn({name: 'Début', prop: 'start', width: 150}),
        new TableColumn({name: 'Domaine', prop: 'training.domain', width: 150}),
        new TableColumn({name: 'Formation', prop: 'training.name', width: 150}),
        new TableColumn({name: 'Ville', prop: 'location.city', width: 80}),
        new TableColumn({name: 'Site', prop: 'location.name', width: 80}),
        new TableColumn({name: 'Prénom', prop: 'trainer.firstName', width: 100}),
        new TableColumn({name: 'Nom', prop: 'trainer.lastName', width: 100}),
        new TableColumn({name: 'Modifier', template: this.editRowTmpl, sortable: false, canAutoResize: false, width: 80}),
        new TableColumn({name: 'Supprimer', template: this.removeRowTmpl, sortable: false, canAutoResize: false, width: 120})
      ]
    });
  }

  private initSearchForm(): void {
    this.searchForm = this.formService.formBuilder.group(this.searchFormObj());
    this.searchFormSubscription = this.searchForm.valueChanges
      .debounceTime(500)
      .do(() => this.dtOptions.offset = 0)
      .subscribe(() => this.updateSessions());
  }

  private searchFormObj(): SessionSearchForm {
    return {
      start: null,
      trainingName: null,
      trainingDomain: null,
      locationName: null,
      locationCity: null,
      firstName: null,
      lastName: null
    };
  }

  private createPageRequest(): PageRequest<Session> {
    return new PageRequest<Session>(this.dtOptions, this.sessionService.formToSession(this.searchForm.value));
  }

  set sessions(sessions: Session[]) {
    this._sessions = sessions;
    this.displayedSessions = sessions;
  }

  get sessions() {
    return this._sessions;
  }

}
