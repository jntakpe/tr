import {Injectable} from '@angular/core';
import {SecurityService} from '../../../../security/security.service';
import {User} from '../../../../security/user';
import {Router} from '@angular/router';

@Injectable()
export class TopbarService {

  constructor(private securityService: SecurityService, private router: Router) {

  }

  getUserInfos(): any {
    const user: User = this.securityService.getCurrentUser();
    if (user) {
      return {
        username: user.login,
        authorities: this.formatAuthorities(user.authorities)
      };
    }
    return {
      username: 'Anonyme',
      authorities: 'Utilisateur'
    };
  }

  logout(): void {
    this.securityService.logout();
    this.router.navigate(['/login']);
  }

  private formatAuthorities(authorities: string[]) {
    const mappedAuthorities = authorities.filter(auth => auth !== 'ROLE_USER').map(this.labelizeAuthority);
    return mappedAuthorities.length === 0 ? 'Utilisateur' : mappedAuthorities.join(' , ');
  }

  private labelizeAuthority(authority: string): string {
    switch (authority) {
      case 'ROLE_ADMIN':
        return 'Administrateur';
      case 'ROLE_TRAINER':
        return 'Formateur';
      default:
        return authority;
    }
  }

}
