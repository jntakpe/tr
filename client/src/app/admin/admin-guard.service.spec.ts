import { TestBed, inject } from '@angular/core/testing';
import { AdminGuard } from './admin-guard.service';
import { SecurityService } from '../security/security.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../shared/navigation.service';
import { AlertService, titleConstants } from '../shared/alert.service';
import { HttpModule } from '@angular/http';

describe('admin guard service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, RouterModule.forChild([])],
      providers: [AdminGuard, SecurityService, AlertService, NavigationService]
    });
  });

  it('should authorize page cuz token valid and roles', inject([AdminGuard, SecurityService, AlertService, NavigationService],
    (adminGuard: AdminGuard, securityService: SecurityService, alertService: AlertService, navigationService: NavigationService) => {
      spyOn(securityService, 'isTokenStillValid').and.returnValue(true);
      spyOn(securityService, 'hasAnyRole').and.returnValue(true);
      spyOn(alertService, 'error');
      spyOn(navigationService, 'goToLoginPage');
      spyOn(navigationService, 'goToHomePage');
      expect(adminGuard.canActivateChild()).toBeTruthy();
      expect(alertService.error).not.toHaveBeenCalled();
      expect(navigationService.goToLoginPage).not.toHaveBeenCalled();
      expect(navigationService.goToHomePage).not.toHaveBeenCalled();
    }));

  it('should not authorize page cuz no roles', inject([AdminGuard, SecurityService, AlertService, NavigationService],
    (adminGuard: AdminGuard, securityService: SecurityService, alertService: AlertService, navigationService: NavigationService) => {
      spyOn(securityService, 'isTokenStillValid').and.returnValue(true);
      spyOn(securityService, 'hasAnyRole').and.returnValue(false);
      spyOn(alertService, 'error');
      spyOn(navigationService, 'goToLoginPage');
      spyOn(navigationService, 'goToHomePage');
      expect(adminGuard.canActivateChild()).toBeFalsy();
      expect(alertService.error).toHaveBeenCalledWith('Vous n\'êtes pas autorisé à accéder à cette page', titleConstants.error.forbidden);
      expect(navigationService.goToLoginPage).not.toHaveBeenCalled();
      expect(navigationService.goToHomePage).toHaveBeenCalled();
    }));

  it('should authorize page cuz token valid and roles', inject([AdminGuard, SecurityService, AlertService, NavigationService],
    (adminGuard: AdminGuard, securityService: SecurityService, alertService: AlertService, navigationService: NavigationService) => {
      spyOn(securityService, 'isTokenStillValid').and.returnValue(false);
      spyOn(securityService, 'hasAnyRole').and.returnValue(true);
      spyOn(alertService, 'error');
      spyOn(navigationService, 'goToLoginPage');
      spyOn(navigationService, 'goToHomePage');
      expect(adminGuard.canActivateChild()).toBeFalsy();
      expect(alertService.error).not.toHaveBeenCalled();
      expect(navigationService.goToLoginPage).toHaveBeenCalled();
      expect(navigationService.goToHomePage).not.toHaveBeenCalled();
    }));
});
