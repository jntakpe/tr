import {Location} from '../admin/location/location';
import {Trainer} from '../admin/trainer/trainer';

export class Session {

  constructor(public start: string, public location: Location, public trainer: Trainer) {
  }

}
