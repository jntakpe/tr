import {Http, RequestOptions, Response, RequestOptionsArgs, Headers} from '@angular/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {SecurityService} from './security.service';
import {NavigationService} from '../shared/navigation.service';

@Injectable()
export class AuthHttp {

  constructor(private http: Http, private navigationService: NavigationService, private securityService: SecurityService) {
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.findAccessToken()
      .flatMap(token => this.http.get(url, this.addTokenToHeaders(token, options)))
      .catch(err => this.handleError(err));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.findAccessToken()
      .flatMap(token => this.http.post(url, body, this.addTokenToHeaders(token, options)))
      .catch(err => this.handleError(err));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.findAccessToken()
      .flatMap(token => this.http.put(url, body, this.addTokenToHeaders(token, options)))
      .catch(err => this.handleError(err));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.findAccessToken()
      .flatMap(token => this.http.delete(url, this.addTokenToHeaders(token, options)))
      .catch(err => this.handleError(err));
  }

  private findAccessToken(): Observable<any> {
    const token = this.securityService.getToken();
    if (!token) {
      this.navigationService.goToLoginPage('unauthorized');
      return Observable.empty();
    }
    if (this.securityService.isTokenStillValid(token)) {
      return Observable.of(token.access_token);
    }
    return this.securityService.loginWithRefresh(token).catch(err => this.handleError(err));
  }

  private addTokenToHeaders(accessToken, options: RequestOptionsArgs = new RequestOptions()): RequestOptionsArgs {
    if (!options.headers) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', `Bearer ${accessToken}`);
    return options;
  }

  private handleError(err: any): Observable<any> {
    if (err.status === 401) {
      this.navigationService.goToLoginPage('expired');
      return Observable.empty();
    } else {
      return Observable.throw(err);
    }
  }

}
