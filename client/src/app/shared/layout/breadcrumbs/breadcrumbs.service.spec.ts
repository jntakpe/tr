import {Routes, RouterModule, Router} from '@angular/router';
import {RootComponent, FakeHomeComponent, FakeFeatureComponent, createRoot, advance} from '../../test/test-utils';
import {TestBed, inject} from '@angular/core/testing/test_bed';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {BreadcrumbsService} from './breadcrumbs.service';
import {fakeAsync} from '@angular/core/testing/fake_async';
import {BreadcrumbsInfo} from './breadcrumbs';

describe('breadcrumbs service', () => {

  const homeRoute = {
    path: 'home',
    component: FakeHomeComponent,
    data: {
      title: 'home',
      breadcrumb: []
    }
  };

  const routes: Routes = [
    {path: '', component: RootComponent},
    homeRoute,
    {
      path: 'feat',
      component: FakeFeatureComponent,
      data: {
        title: 'feat',
        breadcrumb: [new BreadcrumbsInfo(homeRoute)]
      }
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeHomeComponent, FakeFeatureComponent, RootComponent],
      imports: [RouterTestingModule, RouterModule.forChild(routes)],
      providers: [BreadcrumbsService]
    });
  });

  it('should get title on single level route', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      router.navigate(['/home']);
      advance(fixture);
      const activeRoute = router.routerState.snapshot.root.children;
      expect(breadcrumbsService.componentTitleFromRoutes(activeRoute)).toBe('home');
    })));

  it('should get title on multiple level route', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      router.navigate(['/feat']);
      advance(fixture);
      const activeRoute = router.routerState.snapshot.root.children;
      expect(breadcrumbsService.componentTitleFromRoutes(activeRoute)).toBe('feat');
    })));

  it('should get breadcrumb on single level route', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      router.navigate(['/home']);
      advance(fixture);
      const activeRoute = router.routerState.snapshot.root.children;
      const breadcrumbsInfos = breadcrumbsService.componentBreadcrumbsFromRoutes(activeRoute);
      expect(breadcrumbsInfos.length).toBe(0);
      expect(breadcrumbsInfos).toEqual([]);
    })));

  it('should get title on multiple level route', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      router.navigate(['/feat']);
      advance(fixture);
      const activeRoute = router.routerState.snapshot.root.children;
      const breadcrumbsInfos = breadcrumbsService.componentBreadcrumbsFromRoutes(activeRoute);
      expect(breadcrumbsInfos.length).toBe(1);
      expect(breadcrumbsInfos[0].path).toBe('home');
      expect(breadcrumbsInfos[0].title).toBe('home');
    })));

});
