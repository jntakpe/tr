import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {CommonModule} from '@angular/common';
import {SecurityModule} from '../../security/security.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';

@NgModule({
  declarations: [LocationComponent, ConfirmModalComponent],
  imports: [CommonModule, HttpModule, SecurityModule, NgbModule, ReactiveFormsModule],
  exports: [LocationComponent],
  providers: [LocationService]
})
export class LocationModule {
}
