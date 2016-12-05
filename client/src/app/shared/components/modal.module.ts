import {NgModule} from '@angular/core';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from './confirm-modal.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [NgbModalModule.forRoot(), CommonModule],
  declarations: [ConfirmModalComponent],
  exports: [NgbModalModule, ConfirmModalComponent]
})
export class ModalModule {
}
