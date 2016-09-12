import {Component, Input} from '@angular/core';

@Component({
  selector: 'form-help-block',
  template: require('./form-help-block.component.html')
})
export class FormHelpBlockComponent {

  @Input() fieldError: string;

}
