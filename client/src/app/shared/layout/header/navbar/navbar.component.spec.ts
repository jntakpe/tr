import {TestBed} from '@angular/core/testing/test_bed';
import {ComponentFixture} from '@angular/core/testing/component_fixture';
import {NavbarComponent} from './navbar.component';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {RouterModule} from '@angular/router';

describe('navbar component', () => {

  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [RouterTestingModule, RouterModule.forChild([])]
    });
    fixture = TestBed.createComponent(NavbarComponent);
  });

  it('should create component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

});
