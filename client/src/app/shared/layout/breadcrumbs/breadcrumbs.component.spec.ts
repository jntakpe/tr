import {TestBed} from '@angular/core/testing/test_bed';
import {BreadcrumbsComponent} from './breadcrumbs.component';
import {async} from '@angular/core/testing/async';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {RouterModule, Route, NavigationEnd, Event} from '@angular/router';
import {BreadcrumbsService} from './breadcrumbs.service';
import {Observable} from 'rxjs';
import {BreadcrumbsInfo} from './breadcrumbs';

describe('breadcrumb component', () => {

  class MockBreadcrumbsService extends BreadcrumbsService {

    navigationEndEvent(): Observable<Event> {
      return Observable.of(new NavigationEnd(1, 'test', 'test'));
    }

    componentTitleFromRoutes(routes: Route[]): string {
      return 'Test title';
    }

    componentBreadcrumbsFromRoutes(routes: Route[]): BreadcrumbsInfo[] {
      return [new BreadcrumbsInfo({path: 'previous', data: {title: 'Previous title'}})];
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      imports: [RouterTestingModule, RouterModule.forChild([])],
      providers: [
        {provide: BreadcrumbsService, useValue: new MockBreadcrumbsService(null)}
      ]
    });
  });

  it('should create login component', async(() => {
    const component = TestBed.createComponent(BreadcrumbsComponent).componentInstance;
    expect(component).toBeTruthy();
  }));

  it('should get title', async(() => {
    const fixture = TestBed.createComponent(BreadcrumbsComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.componentInstance.title).toBe('Test title');
  }));

  it('should get breadcrumb', async(() => {
    const fixture = TestBed.createComponent(BreadcrumbsComponent);
    fixture.detectChanges();
    const breadcrumbsInfos = fixture.debugElement.componentInstance.breadcrumbsInfos;
    expect(breadcrumbsInfos[0].path).toBe('previous');
    expect(breadcrumbsInfos[0].title).toBe('Previous title');
  }));

});
