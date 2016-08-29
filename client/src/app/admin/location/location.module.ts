import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {LocationComponent} from './location.component';

@NgModule({
  declarations: [LocationComponent],
  imports: [HttpModule],
  exports: [LocationComponent]
})
export class LocationModule {
}
