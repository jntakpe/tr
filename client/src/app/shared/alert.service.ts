import {Injectable} from '@angular/core';
import * as toastr from 'toastr';


@Injectable()
export class AlertService {

  constructor() {
  }

  info(message: string, title?: string) {
    // noinspection TypeScriptUnresolvedFunction
    toastr.info(message, title);
  }

  success(message: string, title?: string) {
    // noinspection TypeScriptUnresolvedFunction
    toastr.success(message, title);
  }

  error(message: string, title?: string) {
    // noinspection TypeScriptUnresolvedFunction
    toastr.error(message, title);
  }

  warning(message: string, title?: string) {
    // noinspection TypeScriptUnresolvedFunction
    toastr.warning(message, title);
  }

  defaultErrorMsg() {
    // noinspection TypeScriptUnresolvedFunction
    toastr.error('Une erreur inconnue est survenue', 'Erreur non gérée');
  }
}
