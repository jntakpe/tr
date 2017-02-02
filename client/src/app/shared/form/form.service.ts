import { FormBuilder, AbstractControl } from '@angular/forms';
import { FormField } from './form-field';
import { Injectable } from '@angular/core';
import { FormMessages } from './form-messages';

@Injectable()
export class FormService {

  constructor(public formBuilder: FormBuilder) {
  }

  buildValidationForm(fields: {[key: string]: FormField}, extra?: AbstractControl): FormMessages {
    const {controlsConfig, messageConfig} = this.buildControlConfig(fields);
    return new FormMessages(this.formBuilder.group(controlsConfig), messageConfig);
  }

  validate(data: any, {formGroup, messages}: FormMessages): {[key: string]: string} {
    const formErrors = {};
    Object.keys(data).forEach(field => {
      const control = formGroup.get(field);
      if (control && control.dirty && control.invalid) {
        for (const error of Object.keys(control.errors)) {
          const message = messages[field] && messages[field][error];
          if (message) {
            formErrors[field] = message;
            break;
          }
        }
      }
    });
    return formErrors;
  }

  private buildControlConfig(fields: {[key: string]: FormField}): any {
    const controlsConfig = {};
    const messageConfig = {};
    Object.keys(fields).forEach(field => {
      if (fields.hasOwnProperty(field)) {
        controlsConfig[field] = fields[field].control;
        messageConfig[field] = fields[field].messages;
      }
    });
    return {controlsConfig, messageConfig};
  }

}
