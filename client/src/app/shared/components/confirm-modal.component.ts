import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';

@Component({
  selector: 'confirm-modal',
  template: require('./confirm-modal.component.html')
})
export class ConfirmModalComponent implements OnInit {

  @ViewChild('content') modalContent;

  message: string;

  title: string;

  constructor(private ngbModal: NgbModal) {
  }

  ngOnInit() {
  }

  open(message: string, title?: string): Observable<any> {
    this.message = message;
    this.title = title;
    return Observable.fromPromise(this.ngbModal.open(this.modalContent).result).catch(() => Observable.empty());
  }

}
