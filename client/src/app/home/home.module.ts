import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { TrainingDetailComponent } from './training-detail/training-detail.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HomeComponent, TrainingDetailComponent],
  imports: [CommonModule],
  exports: [HomeComponent]
})
export class HomeModule {

}
