import {TestBed} from '@angular/core/testing/test_bed';
import {LocationComponent} from './location.component';
import {LocationService} from './location.service';
import {Observable} from 'rxjs';
import {async} from '@angular/core/testing/async';
import {By} from '@angular/platform-browser';
import {Location} from './location';
import {fakeAsync, tick} from '@angular/core/testing/fake_async';
import {TemplateRef} from '@angular/core';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal.component';
import {Angular2DataTableModule} from 'angular2-data-table';
import {ComponentFixture} from '@angular/core/testing/component_fixture';
import {FormModule} from '../../shared/form/form.module';
import {SaveModalComponent} from './modal/save-modal.component';

describe('location component', () => {

  let fixture: ComponentFixture<LocationComponent>;

  class MockLocationService extends LocationService {

    locations: Location[] = [new Location('Triangle', 'Paris'), new Location('Colo1', 'Toulouse')];

    findAll(): Observable<Location[]> {
      return Observable.of(this.locations);
    }

    saveModal(modalContent: TemplateRef<any>, location: Location = new Location('', '')): Observable<Location[]> {
      this.locations.push(location);
      return Observable.of(this.locations);
    }

    removeModal(modalInstance: ConfirmModalComponent, location: Location): Observable<Location[]> {
      this.locations.pop();
      return Observable.of(this.locations);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationComponent, SaveModalComponent],
      imports: [FormModule, Angular2DataTableModule],
      providers: [
        {provide: LocationService, useClass: MockLocationService}
      ]
    });
    fixture = TestBed.createComponent(LocationComponent);
  });

  it('should create location component', async(() => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  }));

  it('should display locations', fakeAsync(() => {
    fixture.detectChanges();
    const tbody = fixture.debugElement.query(By.css('.datatable .datatable-body>div>.datatable-scroll'));
    tick(10);
    fixture.detectChanges();
    expect(tbody).toBeTruthy();
    expect(tbody.children.length).toBe(2);
  }));

  it('should add one location to table', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const tbody = fixture.debugElement.query(By.css('.datatable .datatable-body>div>.datatable-scroll'));
    fixture.detectChanges();
    expect(tbody).toBeTruthy();
    fixture.debugElement.nativeElement.querySelector('button#add-modal').click();
    tick();
    fixture.detectChanges();
    tick(500);
    expect(tbody.children.length).toBe(3);
  }));

  it('should remove one location from table', fakeAsync(() => {
    fixture.detectChanges();
    const tbody = fixture.debugElement.query(By.css('.datatable .datatable-body>div>.datatable-scroll'));
    tick();
    fixture.detectChanges();
    expect(tbody).toBeTruthy();
    fixture.debugElement.nativeElement.querySelector('button.btn.btn-danger.btn-xs:first-child').click();
    tick();
    fixture.detectChanges();
    tick(500);
    expect(tbody.children.length).toBe(1);
  }));

});
