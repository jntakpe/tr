import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Subscription } from 'rxjs';
import { BreadcrumbsInfo } from './breadcrumbs';

@Component({
  selector: 'breadcrumbs-component',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  private title: string;

  private breadcrumbsInfos: BreadcrumbsInfo[];

  private routeSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private breadcrumbsService: BreadcrumbsService) {
  }

  ngOnInit() {
    this.routeSubscription = this.breadcrumbsService.navigationEndEvent().subscribe(() => {
      let {data: {title, breadcrumb}} = this.breadcrumbsService.findContentRoute(this.activatedRoute.snapshot);
      this.title = title;
      this.breadcrumbsInfos = breadcrumb.map(f => f());
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
