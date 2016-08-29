import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {CommonModule} from '@angular/common';
import {SecurityModule} from '../../security/security.module';

@NgModule({
  declarations: [LocationComponent],
  imports: [CommonModule, HttpModule, SecurityModule],
  exports: [LocationComponent],
  providers: [LocationService]
})
export class LocationModule {
}
