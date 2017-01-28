import { TestBed, inject, async, tick, fakeAsync } from '@angular/core/testing';
import { HttpModule, BaseRequestOptions, Http, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { TrainingService } from './training.service';
import { AuthHttp } from '../../security/auth.http';
import { AlertService, titleConstants } from '../../shared/alert.service';
import { NavigationService } from '../../shared/navigation.service';
import { MockBackend, MockConnection } from '@angular/http/testing/mock_backend';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing/router_testing_module';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Training } from './training';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { SecurityService } from '../../security/security.service';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '../../shared/table/table.module';
import { MockSecurityService } from '../../shared/test/test-utils';
import { ModalModule } from '../../shared/components/modal.module';

describe('training service', () => {

  let fixture: ComponentFixture<ModalComponent>;

  @Component({
    selector: 'modal-cmp',
    template: `
    <template ngbModalContainer></template>
    <template #addContent let-close="close"><button id="close-add" (click)="close(saveForm)">Add modal</button></template>
    <confirm-modal #confirmModal></confirm-modal>
  `
  })
  class ModalComponent implements OnInit {

    @ViewChild('addContent') addModalContent;
    @ViewChild('confirmModal') confirmModal;

    saveForm: FormGroup;

    training: Training = new Training('Angular 2', 3, 'Technologies');

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
      this.saveForm = this.formBuilder.group({
        name: ['Angular 2', Validators.required],
        duration: [3, Validators.required],
        domain: ['Technologies', Validators.required]
      });
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [HttpModule, ReactiveFormsModule, RouterTestingModule, TableModule, ModalModule, RouterModule.forChild([])],
      providers: [
        TrainingService,
        AuthHttp,
        AlertService,
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
        {provide: SecurityService, useClass: MockSecurityService}
      ]
    });
    fixture = TestBed.createComponent(ModalComponent);
  });

  it('should get trainings', async(inject([TrainingService, MockBackend], (trainingService: TrainingService, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe((conn: MockConnection) => {
      conn.mockRespond(new Response(new ResponseOptions({
        body: [
          {name: 'AngularJS', duration: 3, domain: 'Technologies'},
          {name: 'ReactJS', duration: 4, domain: 'Technologies'}
        ]
      })));
    });
    trainingService.findAll().subscribe(trainings => {
      expect(trainings).toBeTruthy();
      expect(trainings instanceof Array).toBeTruthy();
      expect(trainings[0].name).toBe('AngularJS');
    }, err => fail('error trainings response'));
  })));

  it('should not get trainings and display error message', async(inject([TrainingService, MockBackend, AlertService],
    (trainingService: TrainingService, mockBackend: MockBackend, alertService: AlertService) => {
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        const error = new Error('test');
        error['status'] = 500;
        conn.mockError(error);
      });
      trainingService.findAll().subscribe(res => fail('should fail'), () => {
        expect(alertService.error).toHaveBeenCalledWith('Impossible de récupérer la liste des formations depuis le serveur',
          titleConstants.error.server);
      });
    })));

  it('should not get trainings and display default error message', async(inject([TrainingService, MockBackend, AlertService],
    (trainingService: TrainingService, mockBackend: MockBackend, alertService: AlertService) => {
      spyOn(alertService, 'defaultErrorMsg');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        const error = new Error('test');
        error['status'] = 400;
        conn.mockError(error);
      });
      trainingService.findAll().subscribe(res => fail('should fail'), () => {
        expect(alertService.defaultErrorMsg).toHaveBeenCalled();
      });
    })));

  it('should create new training and refresh', fakeAsync(inject([MockBackend, TrainingService, AlertService],
    (mockBackend: MockBackend, trainingService: TrainingService, alertService: AlertService) => {
      let trainings = [];
      let postCalled = false;
      let getCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Post) {
          postCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: {
              name: 'Angular 2',
              duration: 3,
              domain: 'Technologies'
            },
            status: 201
          })));
        } else if (conn.request.method === RequestMethod.Get) {
          getCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: [{
              name: 'Angular 2',
              duration: 3,
              domain: 'Technologies'
            }, {
              name: 'ReactJS',
              duration: 4,
              domain: 'Technologies'
            }]
          })));
        }
      });
      trainingService.saveModal(fixture.componentInstance.addModalContent, new Training('Angular 2', 3, 'Technologies'))
        .subscribe(l => trainings = l, err => fail('should save'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(postCalled).toBeTruthy();
      expect(getCalled).toBeTruthy();
      expect(trainings.length).toBe(2);
      expect(alertService.success).toHaveBeenCalledWith('La formation Angular 2 du domaine Technologies a été créée');
    })));

  it('should edit training and refresh', fakeAsync(inject([MockBackend, TrainingService, AlertService],
    (mockBackend: MockBackend, trainingService: TrainingService, alertService: AlertService) => {
      let trainings = [];
      let putCalled = false;
      let getCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Put) {
          putCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: {
              name: 'Angular 2',
              duration: 3,
              domain: 'Technologies'
            },
            status: 200
          })));
        } else if (conn.request.method === RequestMethod.Get) {
          getCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: [{
              name: 'Angular 2',
              duration: 3,
              domain: 'Technologies'
            }, {
              name: 'ReactJS',
              duration: 4,
              domain: 'Technologies'
            }]
          })));
        }
      });
      trainingService.saveModal(fixture.componentInstance.addModalContent, new Training('Angular 2', 3, 'Technologies', 1))
        .subscribe(l => trainings = l, err => fail('should save'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(trainings.length).toBe(2);
      expect(putCalled).toBeTruthy();
      expect(getCalled).toBeTruthy();
      expect(alertService.success).toHaveBeenCalledWith('La formation Angular 2 du domaine Technologies a été modifiée');
    })));

  it('should fail creating cuz bad request', fakeAsync(inject([MockBackend, TrainingService, AlertService],
    (mockBackend: MockBackend, trainingService: TrainingService, alertService: AlertService) => {
      let postCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Post) {
          postCalled = true;
          const error = new Error('Bad request');
          error['status'] = 400;
          error['text'] = function () {
            return this.message;
          };
          conn.mockError(error);
        }
      });
      trainingService.saveModal(fixture.componentInstance.addModalContent, new Training('Angular 2', 3, 'Technologies'))
        .subscribe(() => fail('should empty'), err => fail('should empty'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Bad request', titleConstants.error.badRequest);
    })));

  it('should fail creating cuz server error', fakeAsync(inject([MockBackend, TrainingService, AlertService],
    (mockBackend: MockBackend, trainingService: TrainingService, alertService: AlertService) => {
      let postCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Post) {
          postCalled = true;
          const error = new Error('');
          error['status'] = 500;
          conn.mockError(error);
        }
      });
      trainingService.saveModal(fixture.componentInstance.addModalContent, new Training('Angular 2', 3, 'Technologies'))
        .subscribe(() => fail('should empty'), err => fail('should empty'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Impossible d\'enregistrer la formation', titleConstants.error.server);
    })));

  it('should fail creating cuz unknown error', fakeAsync(inject([MockBackend, TrainingService, AlertService],
    (mockBackend: MockBackend, trainingService: TrainingService, alertService: AlertService) => {
      let postCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      spyOn(alertService, 'defaultErrorMsg');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Post) {
          postCalled = true;
          const error = new Error('');
          error['status'] = 405;
          conn.mockError(error);
        }
      });
      trainingService.saveModal(fixture.componentInstance.addModalContent, new Training('Angular 2', 3, 'Technologies'))
        .subscribe(() => fail('should empty'), err => fail('should empty'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).not.toHaveBeenCalled();
      expect(alertService.defaultErrorMsg).toHaveBeenCalled();
    })));

  it('should fail getting trainings after create', fakeAsync(inject([MockBackend, TrainingService, AlertService],
    (mockBackend: MockBackend, trainingService: TrainingService, alertService: AlertService) => {
      let postCalled = false;
      let getCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.method === RequestMethod.Post) {
          postCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            body: {
              name: 'Angular 2',
              duration: 3,
              domain: 'Technologies'
            },
            status: 201
          })));
        } else if (conn.request.method === RequestMethod.Get) {
          getCalled = true;
          const error = new Error('');
          error['status'] = 500;
          conn.mockError(error);
        }
      });
      trainingService.saveModal(fixture.componentInstance.addModalContent, new Training('Angular 2', 3, 'Technologies'))
        .subscribe(() => fail('should empty'), err => fail('should empty'));
      fixture.debugElement.nativeElement.querySelector('#close-add').click();
      fixture.detectChanges();
      tick();
      expect(postCalled).toBeTruthy();
      expect(getCalled).toBeTruthy();
      expect(alertService.success).toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Impossible de récupérer la liste des formations depuis le serveur',
        titleConstants.error.server);
    })));

  it('should remove one training from table', fakeAsync(inject([MockBackend, TrainingService, AlertService],
    (mockBackend: MockBackend, trainingService: TrainingService, alertService: AlertService) => {
      let trainings = [];
      let deleteCalled = false;
      let getCalled = false;
      let constraintCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.url.indexOf('constraints') === -1) {
          if (conn.request.method === RequestMethod.Delete) {
            deleteCalled = true;
            conn.mockRespond(new Response(new ResponseOptions({
              status: 200
            })));
          } else if (conn.request.method === RequestMethod.Get) {
            getCalled = true;
            conn.mockRespond(new Response(new ResponseOptions({
              body: [{
                name: 'Angular JS',
                duration: 3,
                domain: 'Technologies'
              }]
            })));
          }
        } else {
          constraintCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            status: 204
          })));
        }
      });
      trainingService.removeModal(fixture.componentInstance.confirmModal, new Training('Angular 2', 3, 'Technologies'))
        .subscribe(l => trainings = l, err => fail('should empty'));
      fixture.detectChanges();
      tick();
      fixture.debugElement.nativeElement.querySelector('button#confirm-btn').click();
      fixture.detectChanges();
      tick();
      expect(trainings.length).toBe(1);
      expect(constraintCalled).toBeTruthy();
      expect(deleteCalled).toBeTruthy();
      expect(getCalled).toBeTruthy();
      expect(alertService.success).toHaveBeenCalledWith('La suppression de la formation Angular 2 du domaine Technologies effectuée');
    })));

  it('should fail removing one training from table', fakeAsync(inject([MockBackend, TrainingService, AlertService],
    (mockBackend: MockBackend, trainingService: TrainingService, alertService: AlertService) => {
      let trainings = [];
      let deleteCalled = false;
      let getCalled = false;
      let constraintCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.url.indexOf('constraints') === -1) {
          if (conn.request.method === RequestMethod.Delete) {
            deleteCalled = true;
            const error = new Error();
            error['status'] = 500;
            conn.mockError(error);
          } else if (conn.request.method === RequestMethod.Get) {
            getCalled = true;
            conn.mockRespond(new Response(new ResponseOptions({
              body: [{
                name: 'Angular JS',
                duration: 3,
                domain: 'Technologies'
              }]
            })));
          }
        } else {
          constraintCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            status: 204
          })));
        }
      });
      trainingService.removeModal(fixture.componentInstance.confirmModal, new Training('Angular 2', 3, 'Technologies'))
        .subscribe(err => fail('should empty'), err => fail('should empty'));
      fixture.detectChanges();
      tick();
      fixture.debugElement.nativeElement.querySelector('button#confirm-btn').click();
      fixture.detectChanges();
      tick();
      expect(trainings.length).toBe(0);
      expect(constraintCalled).toBeTruthy();
      expect(deleteCalled).toBeTruthy();
      expect(getCalled).toBeFalsy();
      expect(alertService.success).not.toHaveBeenCalled();
      expect(alertService.error).toHaveBeenCalledWith('Impossible de supprimer la formation Angular 2 du domaine Technologies',
        titleConstants.error.server);
    })));

  it('should fail removing one training from table cuz constraints', fakeAsync(inject([MockBackend, TrainingService, AlertService],
    (mockBackend: MockBackend, trainingService: TrainingService, alertService: AlertService) => {
      let trainings = [];
      let deleteCalled = false;
      let getCalled = false;
      let constraintCalled = false;
      fixture.detectChanges();
      spyOn(alertService, 'success');
      spyOn(alertService, 'error');
      mockBackend.connections.subscribe((conn: MockConnection) => {
        if (conn.request.url.indexOf('constraints') === -1) {
          if (conn.request.method === RequestMethod.Delete) {
            deleteCalled = true;
            const error = new Error();
            error['status'] = 500;
            conn.mockError(error);
          } else if (conn.request.method === RequestMethod.Get) {
            getCalled = true;
            conn.mockRespond(new Response(new ResponseOptions({
              body: [{
                name: 'Angular JS',
                duration: 3,
                domain: 'Technologies'
              }]
            })));
          }
        } else {
          constraintCalled = true;
          conn.mockRespond(new Response(new ResponseOptions({
            status: 200,
            body: ['c1', 'c2']
          })));
        }
      });
      trainingService.removeModal(fixture.componentInstance.confirmModal, new Training('Angular 2', 3, 'Technologies'))
        .subscribe(err => fail('should empty'), err => fail('should empty'));
      fixture.detectChanges();
      tick();
      expect(fixture.debugElement.nativeElement.querySelector('button#confirm-btn')).toBeFalsy();
      fixture.detectChanges();
      tick();
      expect(trainings.length).toBe(0);
      expect(constraintCalled).toBeTruthy();
      expect(deleteCalled).toBeFalsy();
      expect(getCalled).toBeFalsy();
    })));

});
