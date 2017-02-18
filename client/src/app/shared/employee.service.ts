import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import './rxjs.extension';
import {Session} from '../session/session';
import {AuthHttp} from '../security/auth.http';
import {SecurityService} from '../security/security.service';
import {Employee} from './employee';

@Injectable()
export class EmployeeService {

  constructor(private authHttp: AuthHttp, private securityService: SecurityService) {
  }

  findSessions(): Observable<Session[]> {
    if (this.securityService.getCurrentUser()) {
      return this.findEmployeeIdByLogin(this.securityService.getCurrentUser().login)
        .flatMap(employeeId => this.authHttp.get(`/api/employees/${employeeId}/sessions`).map(res => res.json()));
    }
    return Observable.of([]);
  }

  findEmployeeIdByLogin(login: string): Observable<number> {
    return this.authHttp.get(`/api/employees/login/${login}`).map(res => res.json()).map((employee: Employee) => employee.id);
  }

}
