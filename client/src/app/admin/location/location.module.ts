import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {CommonModule} from '@angular/common';
import {SecurityModule} from '../../security/security.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';
import {Angular2DataTableModule} from 'angular2-data-table';
import {FormModule} from '../../shared/form/form.module';
import {SaveModalComponent} from './modal/save-modal.component';
import {FilterService} from '../../shared/table/filter.service';

@NgModule({
  declarations: [LocationComponent, SaveModalComponent, ConfirmModalComponent],
  imports: [CommonModule, HttpModule, SecurityModule, NgbModule, FormModule, Angular2DataTableModule],
  exports: [LocationComponent],
  providers: [LocationService, FilterService]
})
export class LocationModule {
}
