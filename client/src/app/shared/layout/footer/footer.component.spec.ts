import {FooterComponent} from './footer.component';
import {ComponentFixture} from '@angular/core/testing/component_fixture';
import {TestBed} from '@angular/core/testing/test_bed';

describe('footer component', () => {

  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent]
    });
    fixture = TestBed.createComponent(FooterComponent);
  });

  it('should create component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

});
