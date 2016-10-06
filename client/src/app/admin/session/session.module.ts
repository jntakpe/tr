import {NgModule} from '@angular/core';
import {SessionComponent} from './session.component';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {SecurityModule} from '../../security/security.module';
import {ModalModule} from '../../shared/components/modal.module';
import {FormModule} from '../../shared/form/form.module';
import {TableModule} from '../../shared/table/table.module';
import {SessionService} from './session.service';
import {PaginationModule} from '../../shared/pagination/pagination.module';
import {RouterModule} from '@angular/router';
import {SessionEditComponent} from './edit/session-edit.component';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {SelectModule} from 'angular2-select';

@NgModule({
  declarations: [SessionComponent, SessionEditComponent],
  imports: [CommonModule, HttpModule, RouterModule, SecurityModule, ModalModule, FormModule, TableModule, PaginationModule,
    NgbDatepickerModule, SelectModule],
  exports: [SessionComponent, SessionEditComponent],
  providers: [SessionService]
})
export class SessionModule {
}
