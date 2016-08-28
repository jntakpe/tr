import {Injectable} from '@angular/core';
import {Route, Router, Event, NavigationEnd} from '@angular/router';
import {BreadcrumbsInfo} from './breadcrumbs';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/filter';

@Injectable()
export class BreadcrumbsService {

  constructor(private router: Router) {
  }

  navigationEndEvent(): Observable<Event> {
    return this.router.events.filter(e => e instanceof NavigationEnd);
  }

  componentTitleFromRoutes(routes: Route[]): string {
    const titles = this.componentsDatasFromRoutes(routes).map(c => c.data['title']);
    return titles.length ? titles[0] : new Error('No title configured for this route');
  }

  componentBreadcrumbsFromRoutes(routes: Route[]): BreadcrumbsInfo[] {
    const breadcrumbs = this.componentsDatasFromRoutes(routes).map(c => c.data['breadcrumb']);
    return breadcrumbs.length ? breadcrumbs[0] : new Error('No breadcrumb infos configured for this route');
  }

  private componentsDatasFromRoutes(routes: Route[]): any[] {
    return routes
      .filter(route => route.component)
      .filter(route => route.data);
  }

}