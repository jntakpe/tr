import { Routes, RouterModule, Router } from '@angular/router';
import { RootComponent, FakeHomeComponent, FakeFeatureComponent, createRoot, advance } from '../../test/test-utils';
import { TestBed, inject, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing/router_testing_module';
import { BreadcrumbsService } from './breadcrumbs.service';
import { BreadcrumbsInfo } from './breadcrumbs';

describe('breadcrumbs service', () => {

  const homeRoute = {
    path: 'home',
    component: FakeHomeComponent,
    data: {
      title: 'home',
      breadcrumb: []
    }
  };

  const featRoute = {
    path: 'feat',
    component: FakeFeatureComponent,
    data: {
      title: 'feat',
      breadcrumb: [new BreadcrumbsInfo(homeRoute)],
      absolutePath: '/feat'
    }
  };

  const routes: Routes = [
    {path: '', component: RootComponent},
    homeRoute,
    featRoute,
    {
      path: 'child',
      component: FakeFeatureComponent,
      data: {
        title: 'child',
        breadcrumb: [new BreadcrumbsInfo(homeRoute), new BreadcrumbsInfo(featRoute)]
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeHomeComponent, FakeFeatureComponent, RootComponent],
      imports: [RouterTestingModule, RouterModule.forChild(routes)],
      providers: [BreadcrumbsService]
    });
  });

  it('should trigger NavigationEnd event', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      let called = false;
      breadcrumbsService.navigationEndEvent().subscribe(() => called = true);
      expect(called).toBeFalsy();
      router.navigate(['/home']);
      advance(fixture);
      expect(called).toBeTruthy();
    })));

  it('should get title on single level route', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      router.navigate(['/home']);
      advance(fixture);
      const activeRoute = router.routerState.snapshot.root;
      expect(breadcrumbsService.findContentRoute(activeRoute).data['title']).toBe('home');
    })));

  it('should get title on multiple level route', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      router.navigate(['/feat']);
      advance(fixture);
      const activeRoute = router.routerState.snapshot.root;
      expect(breadcrumbsService.findContentRoute(activeRoute).data['title']).toBe('feat');
    })));

  it('should get breadcrumb on single level route', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      router.navigate(['/home']);
      advance(fixture);
      const activeRoute = router.routerState.snapshot.root;
      const breadcrumbsInfos = breadcrumbsService.findContentRoute(activeRoute).data['breadcrumb'];
      expect(breadcrumbsInfos).toEqual([]);
    })));

  it('should get title on multiple level route', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      router.navigate(['/feat']);
      advance(fixture);
      const activeRoute = router.routerState.snapshot.root;
      const breadcrumbsInfos = breadcrumbsService.findContentRoute(activeRoute).data['breadcrumb'];
      expect(breadcrumbsInfos[0].path).toBe('home');
      expect(breadcrumbsInfos[0].title).toBe('home');
    })));

  it('should use abs route if possible', fakeAsync(inject([BreadcrumbsService, Router],
    (breadcrumbsService: BreadcrumbsService, router: Router) => {
      const fixture = createRoot(router, RootComponent);
      router.navigate(['/child']);
      advance(fixture);
      const activeRoute = router.routerState.snapshot.root;
      const breadcrumbsInfos = breadcrumbsService.findContentRoute(activeRoute).data['breadcrumb'];
      expect(breadcrumbsInfos[0].path).toBe('home');
      expect(breadcrumbsInfos[0].title).toBe('home');
      expect(breadcrumbsInfos[1].path).toBe('/feat');
      expect(breadcrumbsInfos[1].title).toBe('feat');
    })));

});
