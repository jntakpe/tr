import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {Location} from './location';

@Injectable()
export class LocationService {

  constructor(private http: Http) {
  }

  findAll(): Observable<Location> {
    return this.http.get('api/locations').do(l => console.log(l));
  }

}
