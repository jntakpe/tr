import {NgModule} from '@angular/core';
import {TrainingModule} from './training/training.module';
import {LocationModule} from './location/location.module';
import {AdminComponent} from './admin.component';
import {RouterModule} from '@angular/router';
import {TrainingComponent} from './training/training.component';
import {LocationComponent} from './location/location.component';
import {AdminGuard} from './admin-guard.service';
import {TrainerModule} from './trainer/trainer.module';

@NgModule({
  imports: [TrainingModule, LocationModule, TrainerModule, RouterModule],
  declarations: [AdminComponent],
  providers: [AdminGuard],
  exports: [TrainingComponent, LocationComponent, TrainingComponent, AdminComponent]
})
export class AdminModule {

}
