import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {SecurityService} from '../security.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from '../user';

@Injectable()
export class LoginService implements OnInit, OnDestroy {

  private portalBgClass = 'portalbg';

  constructor(private securityService: SecurityService, private router: Router) {
  }

  ngOnInit() {
    document.querySelector('body').classList.add(this.portalBgClass)
  }

  ngOnDestroy() {
    document.querySelector('body').classList.remove(this.portalBgClass)
  }

  login(loginForm: FormGroup): Observable<User> {
    return this.securityService.login(loginForm.value.username, loginForm.value.password);
  }

  redirectHome(): void {
    this.router.navigate(['/home']);
  }

}
