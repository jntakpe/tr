import {async} from '@angular/core/testing/async';
import {TestBed} from '@angular/core/testing/test_bed';
import {LoginComponent} from './login.component';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {SecurityModule} from '../security.module';

describe('Login component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SecurityModule, RouterTestingModule],
    });
  }));

  it('it should create login component', async(() => {
    TestBed.compileComponents().then(() => {
      const component = TestBed.createComponent(LoginComponent).componentInstance;
      expect(component).toBeTruthy();
    });
  }));

});
