export class Location {

  static EMPTY_TRAINING = new Location('', '');

  constructor(public name: string, public city: string, public id?: number) {
  }

}
