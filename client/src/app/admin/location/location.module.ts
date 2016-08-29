import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [LocationComponent],
  imports: [CommonModule, HttpModule],
  exports: [LocationComponent],
  providers: [LocationService]
})
export class LocationModule {
}
