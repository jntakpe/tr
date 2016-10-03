import {OnInit, OnDestroy, Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {TrainerService} from './trainer.service';
import {Trainer} from './trainer';
import {TableOptions, ColumnMode, TableColumn} from 'angular2-data-table';
import {FormGroup} from '@angular/forms';
import {FormService} from '../../shared/form/form.service';

@Component({
  selector: 'trainer-component',
  template: require('./trainer.component.html')
})
export class TrainerComponent implements OnInit, OnDestroy {

  displayedTrainers: Trainer[] = [];

  dtOptions: TableOptions;

  trainersSubscription: Subscription;

  searchForm: FormGroup;

  searchFormSubscription: Subscription;

  private _trainers: Trainer[] = [];

  constructor(private trainerService: TrainerService, private formService: FormService) {
  }

  ngOnInit() {
    this.dtOptions = this.buildTableOptions();
    this.trainersSubscription = this.trainerService.findAll().subscribe(trainers => this.trainers = trainers);
    this.initSearchForm();
  }

  ngOnDestroy() {
    this.trainersSubscription.unsubscribe();
  }

  private buildTableOptions(): TableOptions {
    return new TableOptions({
      reorderable: false,
      footerHeight: 50,
      columnMode: ColumnMode.force,
      rowHeight: 'auto',
      limit: 10,
      columns: [
        new TableColumn({name: 'Login', prop: 'login'}),
        new TableColumn({name: 'Email', prop: 'email'}),
        new TableColumn({name: 'Prénom', prop: 'firstName'}),
        new TableColumn({name: 'Nom', prop: 'lastName'})
      ]
    });
  }

  private initSearchForm(): void {
    this.searchForm = this.formService.formBuilder.group({
      login: null,
      email: null,
      firstName: null,
      lastName: null
    });
    this.searchFormSubscription = this.searchForm.valueChanges
      .subscribe(dataForm => this.displayedTrainers = this.trainerService.filterTable(this.trainers, dataForm));
  }

  set trainers(trainers: Trainer[]) {
    this._trainers = trainers;
    this.displayedTrainers = trainers;
    this.initSearchForm();
  }

  get trainers() {
    return this._trainers;
  }
}
