/// <reference path="../../../typings/globals/toastr/index.d.ts" />

import {Injectable} from '@angular/core';
import * as toastr from 'toastr';


@Injectable()
export class AlertService {

  constructor() {
  }

  info(message: string, title?: string) {
    toastr.info(message, title);
  }

  success(message: string, title?: string) {
    toastr.success(message, title);
  }

  error(message: string, title?: string) {
    toastr.error(message, title);
  }

  warning(message: string, title?: string) {
    toastr.warning(message, title);
  }

  defaultErrorMsg() {
    toastr.error('Une erreur inconnue est survenue', 'Erreur non gérée');
  }
}
