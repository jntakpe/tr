import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {SecurityService} from '../security.service';
import {Observable} from 'rxjs';
import {User} from '../user';
import {NavigationService} from '../../shared/navigation.service';

@Injectable()
export class LoginService {

  constructor(private securityService: SecurityService, private navigationService: NavigationService) {
  }

  login(loginForm: FormGroup): Observable<User> {
    return this.securityService.login(loginForm.value.username, loginForm.value.password);
  }

  redirectHome() {
    this.navigationService.goToHomePage();
  }

}
