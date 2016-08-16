import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptionsArgs} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import * as moment from 'moment';
import {User} from './user';
import 'rxjs/add/operator/do';

const jwtDecode = require('jwt-decode');

@Injectable()
export class SecurityService {

  private tokenKey = 'tr_oauth2_auth';

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
      .do(res => this.storeToken(res))
      .map(res => this.mapUser(res.json().access_token))
      .do(user => this.currentUser = user);
  }

  getCurrentUser(): User {
    if (this.currentUser) {
      return this.currentUser;
    }
    const token = this.getToken();
    if (token && token.access_token) {
      this.currentUser = this.mapUser(token.access_token);
      return this.currentUser;
    }
    return null;
  }

  private accessToken(username: string, password: string): Observable<Response> {
    return this.http.post('oauth/token', this.buildTokenRequestBody(username, password), this.buildTokenRequestOption());
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

  private mapUser(accessToken: String): User {
    const plainToken = jwtDecode(accessToken);
    return new User(plainToken.user_name, plainToken.authorities);
  }

  private storeToken(res: Response): any {
    const data = res.json();
    data.expires_at = moment().add(data.expires_in, 's').toDate();
    localStorage.setItem(this.tokenKey, JSON.stringify(data));
    return data;
  }

  private getToken(): any {
    const token = localStorage.getItem(this.tokenKey);
    return token ? JSON.parse(token) : token;
  }

}
