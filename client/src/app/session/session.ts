import { Location } from '../admin/location/location';
import { Trainer } from '../admin/trainer/trainer';
import { Training } from '../admin/training/training';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from '../shared/employee';

export class Session {

  constructor(public start: string|NgbDateStruct,
              public location: Location,
              public trainer: Trainer,
              public training: Training,
              public id?: number,
              public employees?: Employee[]) {
  }

}
