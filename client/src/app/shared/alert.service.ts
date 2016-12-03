import {Injectable, ViewContainerRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class AlertService {

  constructor(public toastr: ToastsManager) {
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
    badRequest: 'Mauvaise requête',
    forbidden: 'Non autorisé'
  }
};
