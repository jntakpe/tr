import {TestBed} from '@angular/core/testing/test_bed';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {Observable} from 'rxjs';
import {async} from '@angular/core/testing/async';
import {By} from '@angular/platform-browser';
import {Location} from './location';
import {fakeAsync, tick} from '@angular/core/testing/fake_async';
import {ReactiveFormsModule} from '@angular/forms';

describe('location component', () => {

  class MockLocationService extends LocationService {

    findAll(): Observable<Location[]> {
      return Observable.of([new Location('Triangle', 'Paris'), new Location('Colo1', 'Toulouse')]);
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: LocationService, useValue: new MockLocationService(null, null, null)}
      ]
    });
  });

  it('should create login component', async(() => {
    const component = TestBed.createComponent(LocationComponent).componentInstance;
    expect(component).toBeTruthy();
  }));

  it('should display locations', fakeAsync(() => {
    const fixture = TestBed.createComponent(LocationComponent);
    fixture.detectChanges();
    const tbody = fixture.debugElement.query(By.css('table tbody'));
    expect(tbody).toBeTruthy();
    tick();
    fixture.detectChanges();
    expect(tbody.children.length).toBe(2);
  }));

});
