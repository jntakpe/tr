import {CanActivateChild} from '@angular/router';
import {Injectable} from '@angular/core';
import {SecurityService} from '../security/security.service';
import {NavigationService} from '../shared/navigation.service';

@Injectable()
export class AdminGuard implements CanActivateChild {

  constructor(private securityService: SecurityService, private navigationService: NavigationService) {
  }

  canActivateChild(): boolean {
    const isAuthorized = this.securityService.hasAnyRole(['ROLE_ADMIN']);
    if (!isAuthorized) {
      this.navigationService.goToHomePage();
    }
    return isAuthorized;
  }

}
