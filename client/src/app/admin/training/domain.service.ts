import {Injectable} from '@angular/core';
import {AuthHttp} from '../../security/auth.http';
import {Observable} from 'rxjs';

@Injectable()
export class DomainService {

  constructor(private authHttp: AuthHttp) {
  }

  findAll(): Observable<string[]> {
    return this.authHttp.get('api/domains').map(res => res.json());
  }

}
