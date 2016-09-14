import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from './confirm-modal.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [NgbModule, CommonModule],
  declarations: [ConfirmModalComponent],
  exports: [NgbModule, ConfirmModalComponent]
})
export class ModalModule {
}
