import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class SecurityService {

  private authParams = {
    clientId: 'trainingrating',
    secret: 'supertrainingratingsecret',
    scope: 'read%20write',
  };

  constructor(private http: Http) {
  }

  login(username: string, password: string) {
    this.accessToken(username, password).subscribe((data) => console.log(data), (error) => console.log(error));
  }

  private accessToken(username: string, password: string): Observable<Response> {
    var data = `username=${username}&password=${password}&grant_type=password&scope=${this.authParams.scope}` +
      `&client_id=${this.authParams.clientId}&client_secret=${this.authParams.secret}`;
    return this.http.post('/oauth/token', data, {
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Basic dHJhaW5pbmdyYXRpbmc6c3VwZXJ0cmFpbmluZ3JhdGluZ3NlY3JldA=='
      })
    });
  }

}
