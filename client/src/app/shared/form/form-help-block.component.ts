import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-help-block',
  templateUrl: './form-help-block.component.html'
})
export class FormHelpBlockComponent {

  @Input() fieldError: string;

}
