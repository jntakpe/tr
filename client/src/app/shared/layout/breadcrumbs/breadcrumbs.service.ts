import {Injectable} from '@angular/core';
import {Route, Router} from '@angular/router';

@Injectable()
export class BreadcrumbsService {

  constructor(private router: Router) {
  }

  componentTitleFromRoutes(routes: Route[]): string {
    const titles = this.componentsDatasFromRoutes(routes).map(c => c.data['title']);
    return titles.length ? titles[0] : new Error('No title configured for this route');
  }

  componentBreadcrumbsFromRoutes(routes: Route[]): string[] {
    const breadcrumbs = this.componentsDatasFromRoutes(routes).map(c => c.data['breadcrumb']);
    return breadcrumbs.length ? breadcrumbs[0] : new Error('No breadcrumb configured for this route');
  }

  private componentsDatasFromRoutes(routes: Route[]): any[] {
    return routes
      .filter(route => route.component)
      .filter(route => route.data);
  }

}
