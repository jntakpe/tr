import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: [HomeService]
})
export class HomeModule {

}
