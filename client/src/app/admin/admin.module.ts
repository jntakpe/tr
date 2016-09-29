import {NgModule} from '@angular/core';
import {TrainingModule} from './training/training.module';
import {LocationModule} from './location/location.module';
import {AdminComponent} from './admin.component';
import {RouterModule} from '@angular/router';
import {AdminGuard} from './admin-guard.service';
import {TrainerModule} from './trainer/trainer.module';
import {SessionModule} from './session/session.module';

@NgModule({
  imports: [TrainingModule, LocationModule, TrainerModule, SessionModule, RouterModule],
  declarations: [AdminComponent],
  providers: [AdminGuard],
  exports: [AdminComponent]
})
export class AdminModule {

}
