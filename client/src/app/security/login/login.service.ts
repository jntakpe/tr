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

  login(loginForm: FormGroup): Observable<User> {
    return this.securityService.login(loginForm.value.username, loginForm.value.password);
  }

  redirectHome() {
    this.navigationService.goToHomePage();
  }

  handleLoginError(error: Response, form: FormGroup, inputElement: ElementRef) {
    this.displayLoginError(error);
    form.reset();
    this.focusElement(inputElement);
  }

  focusElement(element: ElementRef) {
    element.nativeElement.focus();
  }

  private displayLoginError(error: Response) {
    if (error.status === 400) {
      this.alertService.error('Veuillez saisir vos identifiants Sopra Steria', 'Identifiants incorrects');
    } else {
      this.alertService.defaultErrorMsg();
    }
  }


}
