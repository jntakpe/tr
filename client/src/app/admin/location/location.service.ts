import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Location} from './location';
import {AuthHttp} from '../../security/auth.http';

@Injectable()
export class LocationService {

  constructor(private authHttp: AuthHttp) {
  }

  findAll(): Observable<Location> {
    return this.authHttp.get('api/locations').do(l => console.log(l));
  }

}
