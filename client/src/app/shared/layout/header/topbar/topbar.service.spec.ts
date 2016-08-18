import {TestBed, inject} from '@angular/core/testing/test_bed';
import {HttpModule, BaseRequestOptions, Http} from '@angular/http';
import {SecurityService} from '../../../../security/security.service';
import {MockBackend} from '@angular/http/testing/mock_backend';
import {TopbarService} from './topbar.service';
import {User} from '../../../../security/user';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {Routes, Router, RouterModule} from '@angular/router';
import {Location} from '@angular/common';
import {fakeAsync} from '@angular/core/testing/fake_async';
import {RootComponent, FakeLoginComponent, createRoot, advance, tokenJson} from '../../../test/test-utils';

describe('topbar service', () => {

  const routes: Routes = [
    {path: '', component: RootComponent},
    {path: 'login', component: FakeLoginComponent}
  ];

  describe('with http mock', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FakeLoginComponent, RootComponent],
        imports: [HttpModule, RouterTestingModule, RouterModule.forChild(routes)],
        providers: [
          TopbarService,
          SecurityService,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            useFactory: (backend, defaultOptions) => {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          }
        ]
      });
      localStorage.clear();
    });

    it('should inject topbar service', inject([TopbarService], (topbarService: TopbarService) => {
      expect(topbarService).toBeTruthy();
    }));

    it('should get current username',
      inject([TopbarService, SecurityService], (topbarService: TopbarService, securityService: SecurityService) => {
        localStorage.setItem(securityService.tokenKey, JSON.stringify(tokenJson));
        expect(topbarService.getUserInfos().username).toEqual('jntakpe');
      }));

    it('should get default user', inject([TopbarService], (topbarService: TopbarService) => {
      expect(topbarService.getUserInfos().username).toEqual('Anonyme');
      expect(topbarService.getUserInfos().authorities).toEqual('Utilisateur');
    }));

    it('should get formatted authorities',
      inject([TopbarService, SecurityService], (topbarService: TopbarService, securityService: SecurityService) => {
        localStorage.setItem(securityService.tokenKey, JSON.stringify(tokenJson));
        expect(topbarService.getUserInfos().authorities).toEqual('Formateur , Administrateur');
      }));

    it('should logout current user and redirect',
      fakeAsync(
        inject([TopbarService, SecurityService, Router, Location],
          (topbarService: TopbarService, securityService: SecurityService, router: Router, location: Location) => {
            const fixture = createRoot(router, RootComponent);
            localStorage.setItem(securityService.tokenKey, JSON.stringify(tokenJson));
            topbarService.logout();
            expect(localStorage.getItem(securityService.tokenKey)).toBeFalsy();
            advance(fixture);
            expect(location.path()).toBe('/login?from=logout');
          })
      ));
  });

  describe('with security service mocked and no authorities', () => {

    class MockSecurityService extends SecurityService {

      getCurrentUser(): User {
        return new User('toto', []);
      }

    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FakeLoginComponent, RootComponent],
        imports: [RouterTestingModule, RouterModule.forChild(routes)],
        providers: [
          TopbarService,
          {provide: SecurityService, useClass: MockSecurityService}
        ]
      });
    });

    it('should get default authority', inject([TopbarService], (topbarService: TopbarService) => {
      const currentUser = topbarService.getUserInfos();
      expect(currentUser.authorities).toBe('Utilisateur');
      expect(currentUser.username).toBe('toto');
    }));

  });

  describe('with security service mocked and one authority', () => {

    class MockSecurityService extends SecurityService {

      getCurrentUser(): User {
        return new User('toto', ['ROLE_USER']);
      }

    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FakeLoginComponent, RootComponent],
        imports: [RouterTestingModule, RouterModule.forChild(routes)],
        providers: [
          TopbarService,
          {provide: SecurityService, useClass: MockSecurityService}
        ]
      });
    });

    it('should get default authority', inject([TopbarService], (topbarService: TopbarService) => {
      const currentUser = topbarService.getUserInfos();
      expect(currentUser.authorities).toBe('Utilisateur');
      expect(currentUser.username).toBe('toto');
    }));

  });

});
