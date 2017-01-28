import { AppComponent } from './app.component';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';

describe('App: Training Rating', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, RouterModule.forChild([])]
    });
  });

  it('should create the app', async(() => {
    TestBed.compileComponents().then(() => {
      const app = TestBed.createComponent(AppComponent).componentInstance;
      expect(app).toBeTruthy();
    });
  }));

});
