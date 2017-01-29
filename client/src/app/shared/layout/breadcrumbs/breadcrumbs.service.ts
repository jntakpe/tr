import { Injectable } from '@angular/core';
import { Route, Router, Event, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import '../../rxjs.extension';
import 'rxjs/add/operator/filter';

@Injectable()
export class BreadcrumbsService {

  constructor(private router: Router) {
  }

  navigationEndEvent(): Observable<Event> {
    return this.router.events.filter(e => e instanceof NavigationEnd);
  }

  findContentRoute(snapshot: ActivatedRouteSnapshot): Route {
    return this.walkRouteTree(snapshot).routeConfig;
  }

  private walkRouteTree(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    const terminalRoute = snapshot;
    if (snapshot.children && snapshot.children.length > 0) {
      return this.walkRouteTree(snapshot.children[0]);
    }
    return terminalRoute;
  }

}
