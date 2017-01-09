import {Resolve, ActivatedRouteSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {SessionService} from "./session.service";

@Injectable()
export class SessionResolve implements Resolve<any> {

  constructor(private sessionService : SessionService){}

  resolve(route : ActivatedRouteSnapshot){
    return this.sessionService.findSession(route.params['id']);
  }
}
