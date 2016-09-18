import {NgModule} from '@angular/core';
import {TrainingModule} from './training/training.module';
import {LocationModule} from './location/location.module';
import {AdminComponent} from './admin.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [TrainingModule, LocationModule, RouterModule],
  declarations: [AdminComponent],
  exports: [TrainingModule, LocationModule, AdminComponent]
})
export class AdminModule {

}
