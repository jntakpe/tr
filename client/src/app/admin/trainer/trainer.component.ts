import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainerService } from './trainer.service';
import { Trainer } from './trainer';
import { FormGroup } from '@angular/forms';
import { FormService } from '../../shared/form/form.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'trainer-component',
  templateUrl: './trainer.component.html'
})
export class TrainerComponent implements OnInit, OnDestroy {

  displayedTrainers: Trainer[] = [];

  dtOptions: any;

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

  private buildTableOptions() {
    return {
      reorderable: false,
      footerHeight: 50,
      columnMode: ColumnMode.force,
      rowHeight: 'auto',
      limit: 10,
      columns: [
        {name: 'Login', prop: 'login'},
        {name: 'Email', prop: 'email'},
        {name: 'Prénom', prop: 'firstName'},
        {name: 'Nom', prop: 'lastName'}
      ]
    };
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
