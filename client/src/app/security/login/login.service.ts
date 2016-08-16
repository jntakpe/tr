import {Injectable, ElementRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {SecurityService} from '../security.service';
import {Observable} from 'rxjs';
import {User} from '../user';
import {NavigationService} from '../../shared/navigation.service';
import {Response} from '@angular/http';
import {AlertService} from '../../shared/alert.service';

@Injectable()
export class LoginService {

  constructor(private securityService: SecurityService, private navigationService: NavigationService, private alertService: AlertService) {
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

  private displayLoginError(error: Response): void {
    if (error.status === 400) {
      this.alertService.error('Veuillez saisir vos identifiants Sopra Steria', 'Identifiants incorrects');
    } else {
      this.alertService.defaultErrorMsg();
    }
  }


}
