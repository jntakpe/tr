import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {BreadcrumbsService} from './breadcrumbs.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'breadcrumbs-component',
  template: require('./breadcrumbs.component.html')
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  private title: string;

  private breadcrumb: string[];

  private routeSubscription: Subscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.routeSubscription = this.router.events.subscribe(() => {
      const routes = this.activatedRoute.routeConfig.children;
      this.title = this.breadcrumbsService.componentTitleFromRoutes(routes);
      this.breadcrumb = this.breadcrumbsService.componentBreadcrumbsFromRoutes(routes);
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
