import {NgModule} from '@angular/core';
import {TableModule} from '../../shared/table/table.module';
import {FormModule} from '../../shared/form/form.module';
import {SecurityModule} from '../../security/security.module';
import {HttpModule} from '@angular/http';
import {CommonModule} from '@angular/common';
import {TrainingComponent} from './training.component';
import {SaveTrainingModalComponent} from './modal/save-training-modal.component';
import {TrainingService} from './training.service';
import {ModalModule} from '../../shared/components/modal.module';
import {DomainService} from './domain.service';

@NgModule({
  declarations: [TrainingComponent, SaveTrainingModalComponent],
  imports: [CommonModule, HttpModule, SecurityModule, ModalModule, FormModule, TableModule],
  exports: [TrainingComponent],
  providers: [TrainingService, DomainService]
})
export class TrainingModule {

}
