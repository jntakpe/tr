import {NgModule} from '@angular/core';
import {TableModule} from '../../shared/table/table.module';
import {FormModule} from '../../shared/form/form.module';
import {SecurityModule} from '../../security/security.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpModule} from '@angular/http';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule, HttpModule, NgbModule, SecurityModule, FormModule, TableModule]
})
export class TrainingModule {

}
