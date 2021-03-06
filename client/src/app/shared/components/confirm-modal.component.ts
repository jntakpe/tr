import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import '../rxjs.extension';
import {ConstraintsMessage} from '../constraint';

@Component({
  selector: 'tr-confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent implements OnInit {

  @ViewChild('content') modalContent;

  message: string;

  constraints: string[];

  title: string;

  constructor(private ngbModal: NgbModal) {
  }

  ngOnInit() {
  }

  open({message, constraints}: ConstraintsMessage, title?: string): Observable<any> {
    this.message = message;
    this.constraints = constraints;
    this.title = title;
    return Observable.fromPromise(this.ngbModal.open(this.modalContent).result)
      .catch(() => Observable.empty());
  }

}
