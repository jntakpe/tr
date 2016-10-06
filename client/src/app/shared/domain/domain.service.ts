import {Injectable} from '@angular/core';
import {AuthHttp} from '../../security/auth.http';
import {Observable} from 'rxjs';

@Injectable()
export class DomainService {

  private cachedDomains: string[];

  constructor(private authHttp: AuthHttp) {
  }

  findAll(): Observable<string[]> {
    if (this.cachedDomains) {
      return Observable.of(this.cachedDomains);
    }
    return this.authHttp.get('api/domains').map(res => res.json()).do(data => this.cachedDomains = data);
  }

}
