import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptionsArgs} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import * as moment from 'moment';
import {User} from './user';
import 'rxjs/add/operator/do';

var jwtDecode = require('jwt-decode');

@Injectable()
export class SecurityService {

  private authParams = {
    clientId: 'trainingrating',
    secret: 'supertrainingratingsecret',
    scope: 'read%20write',
  };

  private currentUser: User;

  constructor(private http: Http) {
  }

  login(username: string, password: string): Observable<User> {
    return this.accessToken(username, password)
      .do(this.storeToken)
      .map(this.mapUser)
      .do(user => this.currentUser = user);
  }

  private accessToken(username: string, password: string): Observable<Response> {
    return this.http.post('/oauth/token', this.buildTokenRequestBody(username, password), this.buildTokenRequestOption());
  }

  private buildTokenRequestBody(username: string, password: string): string {
    return `username=${username}&password=${password}&grant_type=password&scope=${this.authParams.scope}`
      + `&client_id=${this.authParams.clientId}&client_secret=${this.authParams.secret}`;
  }

  private buildTokenRequestOption(): RequestOptionsArgs {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Basic ${window.btoa(this.authParams.clientId + ':' + this.authParams.secret)}`
    });
    return {headers};
  }

  private mapUser(res: Response): User {
    const data = res.json();
    const plainToken = jwtDecode(data.access_token);
    return new User(plainToken.user_name, plainToken.authorities);
  }

  private storeToken(res: Response): any {
    const data = res.json();
    data.expires_at = moment().add(data.expires_in, 's').toDate();
    localStorage.setItem('tr_oauth2_auth', data);
    return data;
  }

}
