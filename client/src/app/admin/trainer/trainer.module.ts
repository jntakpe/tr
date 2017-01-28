import { NgModule } from '@angular/core';
import { SecurityModule } from '../../security/security.module';
import { ModalModule } from '../../shared/components/modal.module';
import { TableModule } from '../../shared/table/table.module';
import { FormModule } from '../../shared/form/form.module';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { TrainerComponent } from './trainer.component';
import { TrainerService } from './trainer.service';

@NgModule({
  declarations: [TrainerComponent],
  imports: [CommonModule, HttpModule, SecurityModule, FormModule, TableModule, ModalModule],
  exports: [TrainerComponent],
  providers: [TrainerService]
})
export class TrainerModule {
}
