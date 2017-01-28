import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { ColumnMode } from 'angular2-data-table';
import { Subscription, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { TrainingService } from './training.service';
import { FormService } from '../../shared/form/form.service';
import { Training } from './training';
import { SaveTrainingModalComponent } from './modal/save-training-modal.component';
import { DomainService } from '../../shared/domain/domain.service';

@Component({
  selector: 'training-component',
  template: require('./training.component.html')
})
export class TrainingComponent implements OnInit, OnDestroy {

  @ViewChild('editRowTmpl') editRowTmpl: TemplateRef<any>;

  @ViewChild('removeRowTmpl') removeRowTmpl: TemplateRef<any>;

  @ViewChild('saveModal') saveModal: SaveTrainingModalComponent;

  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  displayedTrainings: Training[] = [];

  dtOptions: any;

  searchForm: FormGroup;

  trainingsSubscription: Subscription;

  searchFormSubscription: Subscription;

  domains: Observable<string[]>;

  private _trainings: Training[] = [];

  constructor(private trainingService: TrainingService, private formService: FormService, private domainService: DomainService) {
  }

  ngOnInit() {
    this.dtOptions = this.buildTableOptions();
    this.trainingsSubscription = this.trainingService.findAll().subscribe(trainings => this.trainings = trainings);
    this.domains = this.domainService.findAll();
    this.initSearchForm();
  }

  ngOnDestroy() {
    this.trainingsSubscription.unsubscribe();
    this.searchFormSubscription.unsubscribe();
  }

  openSaveModal(training: Training) {
    this.trainingsSubscription = this.saveModal.save(training).subscribe(trainings => this.trainings = trainings);
  }

  remove(training: Training) {
    this.trainingsSubscription = this.trainingService.removeModal(this.confirmModal, training)
      .subscribe(trainings => this.trainings = trainings);
  }

  private buildTableOptions() {
    return {
      reorderable: false,
      footerHeight: 50,
      columnMode: ColumnMode.force,
      rowHeight: 'auto',
      limit: 10,
      columns: [
        {name: 'Nom', prop: 'name'},
        {name: 'Domaine', prop: 'domain'},
        {name: 'Durée', prop: 'duration'},
        {name: 'Nombre de sessions', prop: 'nbSessions'},
        {name: 'Modifier', cellTemplate: this.editRowTmpl, sortable: false, canAutoResize: false},
        {name: 'Supprimer', cellTemplate: this.removeRowTmpl, sortable: false, canAutoResize: false}
      ]
    };
  }

  private initSearchForm(): void {
    this.searchForm = this.formService.formBuilder.group({
      name: null,
      domain: '',
      duration: null
    });
    this.searchFormSubscription = this.searchForm.valueChanges
      .subscribe(formData => this.displayedTrainings = this.trainingService.filterTable(this.trainings, formData));
  }

  set trainings(trainings: Training[]) {
    this._trainings = trainings;
    this.displayedTrainings = trainings;
    this.initSearchForm();
  }

  get trainings() {
    return this._trainings;
  }

}
