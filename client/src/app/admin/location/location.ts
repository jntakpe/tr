export class Location {

  static EMPTY_LOCATION = new Location('', '');

  constructor(public name: string, public city: string, public id?: number) {
  }

}
