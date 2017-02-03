import {ConfirmModalComponent} from './confirm-modal.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ConstraintsMessage} from '../constraint';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing/component_fixture';

describe('confirm modal', () => {

  let fixture: ComponentFixture<TestComponent>;

  @Component({
    selector: 'tr-modal-cmp',
    template: `
    <template ngbModalContainer></template>
    <tr-confirm-modal #confirmModal></tr-confirm-modal>`
  })
  class TestComponent implements OnInit {

    @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

    ngOnInit() {
    }

    open(constraintsMessage: ConstraintsMessage, title?: string) {
      this.confirmModal.open(constraintsMessage, title);
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmModalComponent, TestComponent],
      imports: [NgbModalModule.forRoot()]
    });
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should create confirm modal component', async(() => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  }));

  it('should open modal with confirm btn', fakeAsync(() => {
    fixture.detectChanges();
    const component: TestComponent = fixture.componentInstance;
    component.open(new ConstraintsMessage('Test'), 'test');
    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('button#confirm-btn')).toBeTruthy();
  }));

  it('should open modal without confirm btn', fakeAsync(() => {
    fixture.detectChanges();
    const component: TestComponent = fixture.componentInstance;
    component.open(new ConstraintsMessage('Test', ['c1']), 'test');
    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('button#confirm-btn')).toBeFalsy();
  }));

});
