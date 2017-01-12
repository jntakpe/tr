import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SaveLocationModalComponent } from './save-location-modal.component';
import { FormModule } from '../../../shared/form/form.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { LocationService } from '../location.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Http, BaseRequestOptions, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing/mock_backend';
import { AlertService } from '../../../shared/alert.service';
import { dispatchEvent } from '@angular/platform-browser/testing/browser_util';
import { AuthHttp } from '../../../security/auth.http';
import { NavigationService } from '../../../shared/navigation.service';
import { RouterTestingModule } from '@angular/router/testing/router_testing_module';
import { RouterModule } from '@angular/router';
import { SecurityService } from '../../../security/security.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../location';
import { By } from '@angular/platform-browser';
import { TableModule } from '../../../shared/table/table.module';

describe('save modal component', () => {

  let fixture: ComponentFixture<TestComponent>;

  @Component({
    selector: 'test-cmp',
    template: `
    <template ngbModalContainer></template>
    <save-location-modal #saveModal></save-location-modal>`
  })
  class TestComponent implements OnInit {

    @ViewChild('saveModal') saveModal: SaveLocationModalComponent;

    ngOnInit() {
    }

    save(location?: Location): Observable<Location[]> {
      return this.saveModal.save(location);
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, SaveLocationModalComponent],
      imports: [
        HttpModule,
        ReactiveFormsModule,
        RouterTestingModule,
        FormModule,
        TableModule,
        NgbModule.forRoot(),
        RouterModule.forChild([])
      ],
      providers: [
        LocationService,
        AlertService,
        SecurityService,
        AuthHttp,
        NavigationService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
      ]

    });
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should create component', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should init empty form', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save().subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const form: FormGroup = componentInstance.saveModal.saveForm;
    expect(form.value.name).toBeFalsy();
    expect(form.value.city).toBeFalsy();
  }));

  it('should init form with location', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save(new Location('test', 'test')).subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const form: FormGroup = componentInstance.saveModal.saveForm;
    expect(form.value.name).toBe('test');
    expect(form.value.city).toBe('test');
  }));

  it('should have valid form', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save(new Location('test', 'test')).subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const btn: HTMLElement = fixture.debugElement.nativeElement.querySelector('.modal-footer button[type="submit"]');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('disabled')).toBeFalsy();
  }));

  it('should have invalid form', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save().subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const btn: HTMLElement = fixture.debugElement.nativeElement.querySelector('.modal-footer button[type="submit"]');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('disabled')).toBe('');
  }));

  it('should have error class', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save(new Location('test', 'test')).subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const nameInput = fixture.debugElement.query(By.css('input#name'));
    const cityInput = fixture.debugElement.query(By.css('input#city'));
    nameInput.nativeElement.value = '';
    cityInput.nativeElement.value = 'test';
    dispatchEvent(nameInput.nativeElement, 'input');
    dispatchEvent(cityInput.nativeElement, 'input');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.form-group')).classes['has-error']).toBeTruthy();
  }));

  it('should not have error class', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save(new Location('test', 'test')).subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const nameInput = fixture.debugElement.query(By.css('input#name'));
    const cityInput = fixture.debugElement.query(By.css('input#city'));
    nameInput.nativeElement.value = 'test';
    cityInput.nativeElement.value = 'test';
    dispatchEvent(nameInput.nativeElement, 'input');
    dispatchEvent(cityInput.nativeElement, 'input');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.form-group')).classes['has-error']).toBeFalsy();
  }));

});
