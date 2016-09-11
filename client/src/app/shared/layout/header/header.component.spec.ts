import {TestBed} from '@angular/core/testing/test_bed';
import {HeaderComponent} from './header.component';
import {ComponentFixture} from '@angular/core/testing/component_fixture';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';

describe('header component', () => {

  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, RouterModule.forChild([])]
    });
    fixture = TestBed.createComponent(HeaderComponent);
  });

  it('should create component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

});
