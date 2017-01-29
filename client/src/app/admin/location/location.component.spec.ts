import { TestBed, async } from '@angular/core/testing';
import { LocationComponent } from './location.component';
import { LocationService } from './location.service';
import { By } from '@angular/platform-browser';
import { Location } from './location';
import { TemplateRef } from '@angular/core';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { FormModule } from '../../shared/form/form.module';
import { SaveLocationModalComponent } from './modal/save-location-modal.component';
import { TableModule } from '../../shared/table/table.module';
import { ModalModule } from '../../shared/components/modal.module';
import '../../shared/rxjs.extension';
import { Observable } from 'rxjs/Observable';

describe('location component', () => {

  let fixture: ComponentFixture<LocationComponent>;

  class MockLocationService extends LocationService {

    locations: Location[] = [new Location('Triangle', 'Paris'), new Location('Colo1', 'Toulouse')];

    constructor() {
      super(null, null, null, null);
    }

    findAll(): Observable<Location[]> {
      return Observable.of(this.locations);
    }

    saveModal(modalContent: TemplateRef<any>, location: Location = Location.EMPTY_LOCATION): Observable<Location[]> {
      this.locations.push(location);
      return Observable.of(this.locations);
    }

    removeModal(modalInstance: ConfirmModalComponent, location: Location): Observable<Location[]> {
      const temp = this.locations;
      temp.pop();
      return Observable.of(temp);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationComponent, SaveLocationModalComponent],
      imports: [FormModule, TableModule, ModalModule],
      providers: [
        {provide: LocationService, useValue: new MockLocationService()}
      ]
    });
    fixture = TestBed.createComponent(LocationComponent);
  });

  it('should create location component', async(() => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  }));

  it('should display locations', async(() => {
    fixture.detectChanges();
    const tbody = fixture.debugElement.query(By.css('.ngx-datatable .datatable-body .datatable-scroll'));
    fixture.detectChanges();
    expect(tbody).toBeTruthy();
    expect(tbody.children.length).toBe(2);
  }));

  it('should add one location to table', async(() => {
    fixture.detectChanges();
    fixture.debugElement.nativeElement.querySelector('button#add-modal').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.displayedLocations.length).toBe(3);
  }));

  it('should remove one location from table', async(() => {
    fixture.detectChanges();
    fixture.debugElement.nativeElement.querySelector('button.btn.btn-danger.btn-xs:first-child').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.displayedLocations.length).toBe(1);
  }));

});
