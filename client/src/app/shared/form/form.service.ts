import {FormBuilder} from '@angular/forms';
import {FormField} from './form-field';
import {Injectable} from '@angular/core';
import {FormMessages} from './form-messages';

@Injectable()
export class FormService {

  constructor(public formBuilder: FormBuilder) {
  }

  buildValidationForm(fields: {[key: string]: FormField}): FormMessages {
    const {controlsConfig, messageConfig} = this.buildControlConfig(fields);
    return new FormMessages(this.formBuilder.group(controlsConfig), messageConfig);
  }

  validate(data: any, {formGroup, messages}: FormMessages): {[key: string]: string} {
    const formErrors = {};
    for (const field in data) {
      if (data.hasOwnProperty(field)) {
        const control = formGroup.get(field);
        if (control && control.dirty && control.invalid) {
          for (const error in control.errors) {
            if (control.errors.hasOwnProperty(error)) {
              const message = messages[field] && messages[field][error];
              if (message) {
                formErrors[field] = message;
                break;
              }
            }
          }
        }
      }
    }
    return formErrors;
  }

  private buildControlConfig(fields: {[key: string]: FormField}): any {
    const controlsConfig = {};
    const messageConfig = {};
    for (const field in fields) {
      if (fields.hasOwnProperty(field)) {
        controlsConfig[field] = fields[field].control;
        messageConfig[field] = fields[field].messages;
      }
    }
    return {controlsConfig, messageConfig};
  }

}
