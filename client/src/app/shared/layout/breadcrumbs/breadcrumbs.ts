import { Route } from '@angular/router';

export class BreadcrumbsInfo {

  title: string;

  path: string;

  constructor(route: Route) {
    this.title = route.data['title'];
    this.path = route.data['absolutePath'] ? route.data['absolutePath'] : route.path;
  }

}
