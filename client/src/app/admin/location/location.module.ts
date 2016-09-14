import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {CommonModule} from '@angular/common';
import {SecurityModule} from '../../security/security.module';
import {FormModule} from '../../shared/form/form.module';
import {TableModule} from '../../shared/table/table.module';
import {SaveLocationModalComponent} from './modal/save-location-modal.component';
import {ModalModule} from '../../shared/components/modal.module';

@NgModule({
  declarations: [LocationComponent, SaveLocationModalComponent],
  imports: [CommonModule, HttpModule, SecurityModule, FormModule, TableModule, ModalModule],
  exports: [LocationComponent],
  providers: [LocationService]
})
export class LocationModule {
}
