import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormService} from './form.service';

@NgModule({
  imports: [ReactiveFormsModule],
  providers: [FormService],
  exports: [ReactiveFormsModule]
})
export class FormModule {
}
