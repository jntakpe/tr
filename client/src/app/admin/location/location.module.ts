import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {CommonModule} from '@angular/common';
import {SecurityModule} from '../../security/security.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';
import {FormModule} from '../../shared/form/form.module';
import {SaveModalComponent} from './modal/save-modal.component';
import {TableModule} from '../../shared/table/table.module';

@NgModule({
  declarations: [LocationComponent, SaveModalComponent, ConfirmModalComponent],
  imports: [CommonModule, HttpModule, NgbModule, SecurityModule, FormModule, TableModule],
  exports: [LocationComponent],
  providers: [LocationService]
})
export class LocationModule {
}
