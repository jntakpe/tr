import { FormGroup } from '@angular/forms';

export class FormMessages {

  constructor(public formGroup: FormGroup, public messages: {[key: string]: string}) {
  }

}
