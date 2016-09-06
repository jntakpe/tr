import {Injectable} from '@angular/core';
import * as toastr from 'toastr';

@Injectable()
export class AlertService {

  toastr: Toastr;

  constructor() {
    this.toastr = toastr;
    this.toastr.options = {
      progressBar: true,
      closeButton: true
    };
  }

  info(message: string, title?: string) {
    this.toastr.info(message, title);
  }

  success(message: string, title?: string) {
    this.toastr.success(message, title);
  }

  error(message: string, title?: string) {
    this.toastr.error(message, title);
  }

  warning(message: string, title?: string) {
    this.toastr.warning(message, title);
  }

  defaultErrorMsg() {
    this.toastr.error('Une erreur inconnue est survenue', 'Erreur non gérée');
  }
}

export const titleConstants = {
  error: {
    server: 'Erreur serveur',
    badRequest: 'Mauvaise requête'
  }
};
