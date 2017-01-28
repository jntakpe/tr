import { Location } from '../admin/location/location';
import { Trainer } from '../admin/trainer/trainer';
import { Training } from '../admin/training/training';

export class Session {

  static EMPTY_SESSION = new Session('', null, null, null);

  constructor(public start: string, public location: Location, public trainer: Trainer, public training: Training, public id?: number) {
  }

}
