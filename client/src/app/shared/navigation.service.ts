import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class NavigationService {

  constructor(private router: Router) {
  }

  goToHomePage(param?: string) {
    if (param) {
      this.router.navigate(['/home'], {queryParams: {from: param}});
    } else {
      this.router.navigate(['/home']);
    }
  }

  goToLoginPage(param?: string) {
    if (param) {
      this.router.navigate(['/login'], {queryParams: {from: param}});
    } else {
      this.router.navigate(['/login']);
    }
  }

}
