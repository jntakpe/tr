import {Routes, RouterModule, Router} from '@angular/router';
import {RootComponent, FakeHomeComponent, createRoot, advance} from './test/test-utils';
import {TestBed, inject} from '@angular/core/testing/test_bed';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {NavigationService} from './navigation.service';
import {Location} from '@angular/common';
import {fakeAsync} from '@angular/core/testing/fake_async';

describe('navigation service', () => {

  const routes: Routes = [
    {path: '', component: RootComponent},
    {path: 'home', component: FakeHomeComponent},
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeHomeComponent, RootComponent],
      imports: [RouterTestingModule, RouterModule.forChild(routes)],
      providers: [NavigationService]
    });
  });

  it('should go to home page', fakeAsync(inject([NavigationService, Router, Location],
    (navigationService: NavigationService, router: Router, location: Location) => {
      const fixture = createRoot(router, RootComponent);
      expect(location.path()).not.toBe('/home');
      navigationService.goToHomePage();
      advance(fixture);
      expect(location.path()).toBe('/home');
    })));

});
