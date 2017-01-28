import { Injectable, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SecurityService } from '../security.service';
import { Observable } from 'rxjs';
import { User } from '../user';
import { NavigationService } from '../../shared/navigation.service';
import { Response } from '@angular/http';
import { AlertService } from '../../shared/alert.service';
import { Params } from '@angular/router';

@Injectable()
export class LoginService {

  constructor(private securityService: SecurityService,
              private navigationService: NavigationService,
              private alertService: AlertService) {
  }

  login(username: string, password: string): Observable<User> {
    return this.securityService.login(username, password);
  }

  redirectHome(): void {
    this.navigationService.goToHomePage();
  }

  handleLoginError(error: Response, form: FormGroup, inputElement: ElementRef): void {
    this.displayLoginError(error);
    form.reset();
    this.focusElement(inputElement);
  }

  focusElement(element: ElementRef): void {
    element.nativeElement.focus();
  }

  displayRedirectMessage({from}: Params): void {
    if (from === 'logout') {
      this.alertService.success('Vous êtes à présent déconnecté', 'Deconnexion');
    } else if (from === 'expired') {
      this.alertService.error('Votre session a expiré. Veuillez vous reconnecter', 'Expiration de session');
    } else if (from === 'unauthorized') {
      this.alertService.error('Vous n\'êtes pas connecté. Veuillez vous connecter', 'Connexion obligatoire');
    }
  }

  private displayLoginError({status}: Response): void {
    if (status === 400) {
      this.alertService.error('Veuillez saisir vos identifiants Sopra Steria', 'Identifiants incorrects');
    } else {
      this.alertService.defaultErrorMsg();
    }
  }


}
