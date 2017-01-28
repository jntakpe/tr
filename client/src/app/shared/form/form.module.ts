import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormService } from './form.service';
import { FormHelpBlockComponent } from './form-help-block.component';

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [FormHelpBlockComponent],
  providers: [FormService],
  exports: [ReactiveFormsModule, FormHelpBlockComponent]
})
export class FormModule {
}
