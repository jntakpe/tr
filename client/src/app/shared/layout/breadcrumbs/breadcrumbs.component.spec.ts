import {TestBed} from '@angular/core/testing/test_bed';
import {BreadcrumbsComponent} from './breadcrumbs.component';
import {async} from '@angular/core/testing/async';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {RouterModule, NavigationEnd, Event, Route, ActivatedRouteSnapshot} from '@angular/router';
import {BreadcrumbsService} from './breadcrumbs.service';
import {Observable} from 'rxjs';
import {By} from '@angular/platform-browser/src/dom/debug/by';
import {BreadcrumbsInfo} from './breadcrumbs';

describe('breadcrumb component', () => {

  class MockBreadcrumbsService extends BreadcrumbsService {

    navigationEndEvent(): Observable<Event> {
      return Observable.of(new NavigationEnd(1, 'test', 'test'));
    }


    findContentRoute(snapshot: ActivatedRouteSnapshot): Route {
      return {
        data: {
          title: 'Test title', breadcrumb: [new BreadcrumbsInfo({
            path: 'previous',
            data: {
              title: 'Previous title',
              breadcrumb: []
            }
          })]
        }
      };
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

  it('should display title', async(() => {
    const fixture = TestBed.createComponent(BreadcrumbsComponent);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('h1')).nativeElement.textContent;
    expect(title).toBe('Test title');
  }));

  it('should display previous link', async(() => {
    const fixture = TestBed.createComponent(BreadcrumbsComponent);
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('ul li a')).nativeElement;
    expect(link.href).toContain('/previous');
    expect(link.textContent).toBe('Previous title');
  }));

  it('should display last title', async(() => {
    const fixture = TestBed.createComponent(BreadcrumbsComponent);
    fixture.detectChanges();
    const li = fixture.debugElement.query(By.css('ul li:last-child')).nativeElement;
    expect(li.textContent).toBe('Test title');
  }));

});
