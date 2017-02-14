import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { TrainingDetailComponent } from './training-detail/training-detail.component';
import { EmployeeService } from '../shared/employee.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HomeComponent, TrainingDetailComponent],
  imports: [CommonModule],
  exports: [HomeComponent],
  providers: [EmployeeService]
})
export class HomeModule {

}
