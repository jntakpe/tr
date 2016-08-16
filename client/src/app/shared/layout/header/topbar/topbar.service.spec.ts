import {TestBed, inject} from '@angular/core/testing/test_bed';
import {HttpModule, BaseRequestOptions, Http} from '@angular/http';
import {SecurityService} from '../../../../security/security.service';
import {MockBackend} from '@angular/http/testing/mock_backend';
import {TopbarService} from './topbar.service';
import {User} from '../../../../security/user';

const tokenJson = require('../../../../security/token-response.json');

describe('topbar service', () => {

  describe('with http mock', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpModule],
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
          }]
      });
      localStorage.clear();
    });

    it('should inject topbar service', inject([TopbarService], (topbarService: TopbarService) => {
      expect(topbarService).toBeTruthy();
    }));

    it('should get current username', inject([TopbarService], (topbarService: TopbarService) => {
      localStorage.setItem('tr_oauth2_auth', JSON.stringify(tokenJson));
      expect(topbarService.getCurrentUserWithFormattedAuthories().username).toEqual('jntakpe');
    }));

    it('should get default user', inject([TopbarService], (topbarService: TopbarService) => {
      expect(topbarService.getCurrentUserWithFormattedAuthories().username).toEqual('Anonyme');
      expect(topbarService.getCurrentUserWithFormattedAuthories().authorities).toEqual('Utilisateur');
    }));

    it('should get formatted authorities', inject([TopbarService], (topbarService: TopbarService) => {
      localStorage.setItem('tr_oauth2_auth', JSON.stringify(tokenJson));
      expect(topbarService.getCurrentUserWithFormattedAuthories().authorities).toEqual('Formateur | Administrateur');
    }));
  });

  describe('with security service mocked and no authorities', () => {

    class MockSecurityService extends SecurityService {

      getCurrentUser(): User {
        return new User('toto', []);
      }

    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TopbarService,
          {provide: SecurityService, useClass: MockSecurityService}
        ]
      });
    });

    it('should get default authority', inject([TopbarService], (topbarService: TopbarService) => {
      const currentUser = topbarService.getCurrentUserWithFormattedAuthories();
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
        providers: [
          TopbarService,
          {provide: SecurityService, useClass: MockSecurityService}
        ]
      });
    });

    it('should get default authority', inject([TopbarService], (topbarService: TopbarService) => {
      const currentUser = topbarService.getCurrentUserWithFormattedAuthories();
      expect(currentUser.authorities).toBe('Utilisateur');
      expect(currentUser.username).toBe('toto');
    }));

  });

});
