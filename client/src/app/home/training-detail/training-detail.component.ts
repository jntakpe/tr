import { Component, OnInit, Input } from '@angular/core';
import { Session } from '../../session/session';

@Component({
  selector: 'tr-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss']
})
export class TrainingDetailComponent implements OnInit {

  @Input() session: Session;

  constructor() {
  }

  ngOnInit() {
  }

}
