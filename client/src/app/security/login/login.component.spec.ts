import {async} from '@angular/core/testing/async';
import {TestBed} from '@angular/core/testing/test_bed';
import {LoginComponent} from './login.component';

describe('Login component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [LoginComponent]});
  }));

  it('it should create login component', async(() => {
    TestBed.compileComponents().then(() => {
      const component = TestBed.createComponent(LoginComponent).componentInstance;
      expect(component).toBeTruthy();
    });
  }));

});
