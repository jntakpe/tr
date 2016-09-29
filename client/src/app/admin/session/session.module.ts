import {NgModule} from '@angular/core';
import {SessionComponent} from './session.component';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {SecurityModule} from '../../security/security.module';
import {ModalModule} from '../../shared/components/modal.module';
import {FormModule} from '../../shared/form/form.module';
import {TableModule} from '../../shared/table/table.module';
import {SessionService} from './session.service';

@NgModule({
  declarations: [SessionComponent],
  imports: [CommonModule, HttpModule, SecurityModule, ModalModule, FormModule, TableModule],
  exports: [SessionComponent],
  providers: [SessionService]
})
export class SessionModule {
}
