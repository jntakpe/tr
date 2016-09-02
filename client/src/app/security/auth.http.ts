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
    return this.intercept(this.http.get(url, this.addTokenToHeaders(options)));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(this.http.post(url, body, this.addTokenToHeaders(options)));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(this.http.put(url, body, this.addTokenToHeaders(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(this.http.delete(url, this.addTokenToHeaders(options)));
  }

  private addTokenToHeaders(options: RequestOptionsArgs = new RequestOptions()): RequestOptionsArgs {
    if (!options.headers) {
      options.headers = new Headers(); // TODO tester syntaxe
    }
    const token = this.securityService.getToken();
    if (token && this.securityService.isTokenStillValid(token)) {
      options.headers.append('Authorization', `Bearer ${token.access_token}`);
    }
    return options;
  }

  private intercept(response: Observable<Response>): Observable<Response> {
    return response.catch(err => {
      if (err.status === 401) {
        this.navigationService.goToLoginPage('expired');
        return Observable.empty();
      } else {
        return Observable.throw(err);
      }
    });
  }

}
