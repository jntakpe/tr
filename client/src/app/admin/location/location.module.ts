import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {CommonModule} from '@angular/common';
import {SecurityModule} from '../../security/security.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';
import {Angular2DataTableModule} from 'angular2-data-table';

@NgModule({
  declarations: [LocationComponent, ConfirmModalComponent],
  imports: [CommonModule, HttpModule, SecurityModule, NgbModule, ReactiveFormsModule, Angular2DataTableModule],
  exports: [LocationComponent],
  providers: [LocationService]
})
export class LocationModule {
}
