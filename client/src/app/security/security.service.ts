import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptionsArgs} from '@angular/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {User} from './user';

const jwtDecode = require('jwt-decode');

@Injectable()
export class SecurityService {

  tokenKey = 'tr_oauth2_auth';

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

  loginWithRefresh({refresh_token} = this.getToken()): Observable<string> {
    return this.refreshToken(refresh_token)
      .do(res => this.storeToken(res))
      .map(res => res.json().access_token);
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

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser = null;
  }

  getToken(): any {
    const token = localStorage.getItem(this.tokenKey);
    return token ? JSON.parse(token) : token;
  }

  isTokenStillValid(token = this.getToken()): boolean {
    return token && token.expires_at && moment(token.expires_at).isAfter(moment());
  }

  private accessToken(username: string, password: string): Observable<Response> {
    return this.http.post('oauth/token', this.buildTokenRequestBody(username, password), this.buildTokenRequestOption());
  }

  private refreshToken(refreshToken: string): Observable<Response> {
    return this.http.post('oauth/token', this.buildRefreshTokenRequestBody(refreshToken), this.buildTokenRequestOption());
  }

  private buildTokenRequestBody(username: string, password: string): string {
    return `username=${username}&password=${password}&grant_type=password&scope=${this.authParams.scope}`
      + `&client_id=${this.authParams.clientId}&client_secret=${this.authParams.secret}`;
  }

  private buildRefreshTokenRequestBody(token: string): string {
    return `grant_type=refresh_token&refresh_token=${token}`;
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

}
