import { TestBed, async } from '@angular/core/testing';
import { TrainingComponent } from './training.component';
import { TrainingService } from './training.service';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Training } from './training';
import { TemplateRef } from '@angular/core';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { FormModule } from '../../shared/form/form.module';
import { SaveTrainingModalComponent } from './modal/save-training-modal.component';
import { TableModule } from '../../shared/table/table.module';
import { ModalModule } from '../../shared/components/modal.module';
import { DomainService } from '../../shared/domain/domain.service';

describe('training component', () => {

  let fixture: ComponentFixture<TrainingComponent>;

  class MockDomainService extends DomainService {

    findAll(): Observable<string[]> {
      return Observable.of(['Technologies', 'Commerce']);
    }
  }

  class MockTrainingService extends TrainingService {

    trainings: Training[] = [new Training('Angular 2', 3, 'Technologies'), new Training('AngularJS', 3, 'Technologies')];

    findAll(): Observable<Training[]> {
      return Observable.of(this.trainings);
    }

    saveModal(modalContent: TemplateRef<any>, training: Training = Training.EMPTY_TRAINING): Observable<Training[]> {
      this.trainings.push(training);
      return Observable.of(this.trainings);
    }

    removeModal(modalInstance: ConfirmModalComponent, training: Training): Observable<Training[]> {
      const temp = this.trainings;
      temp.pop();
      return Observable.of(temp);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingComponent, SaveTrainingModalComponent],
      imports: [FormModule, TableModule, ModalModule],
      providers: [
        {provide: TrainingService, useClass: MockTrainingService},
        {provide: DomainService, useClass: MockDomainService}
      ]
    });
    fixture = TestBed.createComponent(TrainingComponent);
  });

  it('should create training component', async(() => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  }));

  it('should display trainings', async(() => {
    fixture.detectChanges();
    const tbody = fixture.debugElement.query(By.css('.datatable .datatable-body .datatable-scroll'));
    fixture.detectChanges();
    expect(tbody).toBeTruthy();
    expect(tbody.children.length).toBe(2);
  }));

  it('should display domains', async(() => {
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('#search-domain'));
    fixture.detectChanges();
    expect(select).toBeTruthy();
    expect(select.children.length).toBe(3);
  }));

  it('should add one training to table', async(() => {
    fixture.detectChanges();
    fixture.debugElement.nativeElement.querySelector('button#add-modal').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.displayedTrainings.length).toBe(3);
  }));

  it('should remove one training from table', async(() => {
    fixture.detectChanges();
    const tbody = fixture.debugElement.query(By.css('.datatable .datatable-body .datatable-scroll'));
    expect(tbody).toBeTruthy();
    expect(tbody.children.length).toBe(2);
    const firstBtn = tbody.nativeElement.querySelector('button.btn.btn-danger.btn-xs:first-child');
    expect(firstBtn).toBeTruthy();
    firstBtn.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.displayedTrainings.length).toBe(1);
  }));

});
