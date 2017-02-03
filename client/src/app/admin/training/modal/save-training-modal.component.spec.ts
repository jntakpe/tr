import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {SaveTrainingModalComponent} from './save-training-modal.component';
import {FormModule} from '../../../shared/form/form.module';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ComponentFixture} from '@angular/core/testing/component_fixture';
import {TrainingService} from '../training.service';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {BaseRequestOptions, Http, HttpModule} from '@angular/http';
import {MockBackend} from '@angular/http/testing/mock_backend';
import {AlertService} from '../../../shared/alert.service';
import {dispatchEvent} from '@angular/platform-browser/testing/browser_util';
import {AuthHttp} from '../../../security/auth.http';
import {NavigationService} from '../../../shared/navigation.service';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {RouterModule} from '@angular/router';
import {SecurityService} from '../../../security/security.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import '../../../shared/rxjs.extension';
import {Training} from '../training';
import {By} from '@angular/platform-browser';
import {TableModule} from '../../../shared/table/table.module';

describe('save modal component', () => {

  let fixture: ComponentFixture<TestComponent>;

  @Component({
    selector: 'tr-test-cmp',
    template: `
    <template ngbModalContainer></template>
    <tr-save-training-modal #saveModal [domains]="domains"></tr-save-training-modal>`
  })
  class TestComponent implements OnInit {

    @ViewChild('saveModal') saveModal: SaveTrainingModalComponent;

    domains = Observable.of(['Management', 'Technologies']);

    ngOnInit() {
    }

    save(training?: Training): Observable<Training[]> {
      return this.saveModal.save(training);
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, SaveTrainingModalComponent],
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule, FormModule, TableModule, NgbModule, NgbModalModule.forRoot(),
        RouterModule.forChild([])],
      providers: [
        TrainingService,
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
    expect(form.value.duration).toBeFalsy();
  }));

  it('should init form with training', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save(new Training('Angular 2', 3, 'Technologies')).subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const form: FormGroup = componentInstance.saveModal.saveForm;
    expect(form.value.name).toBe('Angular 2');
    expect(form.value.duration).toBe(3);
    expect(form.value.domain).toBe('Technologies');
  }));

  it('should have valid form', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save(new Training('Angular 2', 3, 'Technologies')).subscribe(() => {
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
    componentInstance.save(new Training('Angular 2', 3, 'Technologies')).subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const nameInput = fixture.debugElement.query(By.css('input#name'));
    const durationInput = fixture.debugElement.query(By.css('input#duration'));
    const domainSelect = fixture.debugElement.query(By.css('select#domain'));
    nameInput.nativeElement.value = '';
    durationInput.nativeElement.value = 3;
    dispatchEvent(nameInput.nativeElement, 'input');
    dispatchEvent(durationInput.nativeElement, 'input');
    dispatchEvent(domainSelect.nativeElement, 'input');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.form-group')).classes['has-error']).toBeTruthy();
  }));

  it('should not have error class', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save(new Training('Angular 2', 3, 'Technologies')).subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const nameInput = fixture.debugElement.query(By.css('input#name'));
    const durationInput = fixture.debugElement.query(By.css('input#duration'));
    const domainSelect = fixture.debugElement.query(By.css('select#domain'));
    nameInput.nativeElement.value = 'test';
    durationInput.nativeElement.value = 2;
    durationInput.nativeElement.value = 'Technologies';
    dispatchEvent(nameInput.nativeElement, 'input');
    dispatchEvent(durationInput.nativeElement, 'input');
    dispatchEvent(domainSelect.nativeElement, 'input');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.form-group')).classes['has-error']).toBeFalsy();
  }));

  it('should init select', fakeAsync(() => {
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;
    componentInstance.save(new Training('Angular 2', 3, 'Technologies')).subscribe(() => {
    });
    tick();
    fixture.detectChanges();
    const domainSelect = fixture.debugElement.query(By.css('select#domain'));
    expect(domainSelect.children.length).toBe(3);
  }));

});
