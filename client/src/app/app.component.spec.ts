import {AppComponent} from './app.component';
import {TestBed} from '@angular/core/testing/test_bed';
import {async} from '@angular/core/testing/async';

describe('App: Client', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [AppComponent]});
  });

  it('should create the app', async(() => {
    TestBed.compileComponents().then(() => {
      const app = TestBed.createComponent(AppComponent).componentInstance;
      expect(app).toBeTruthy();
    });
  }));

  it('should have as title \'app works!\'', async(() => {
    TestBed.compileComponents().then(() => {
      const app = TestBed.createComponent(AppComponent).componentInstance;
      expect(app.title).toEqual('app works!');
    });
  }));

});
