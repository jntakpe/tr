import {CanActivateChild} from '@angular/router';
import {Injectable} from '@angular/core';
import {SecurityService} from '../security/security.service';
import {NavigationService} from '../shared/navigation.service';
import {AlertService, titleConstants} from '../shared/alert.service';

@Injectable()
export class AdminGuard implements CanActivateChild {

  constructor(private securityService: SecurityService, private navigationService: NavigationService, private alertService: AlertService) {
  }

  canActivateChild(): boolean {
    const isAuthorized = this.securityService.hasAnyRole(['ROLE_ADMIN']);
    if (!isAuthorized) {
      this.alertService.error('Vous n\'êtes pas autorisé à accéder à cette page', titleConstants.error.forbidden);
      this.navigationService.goToHomePage();
    }
    return isAuthorized;
  }

}
