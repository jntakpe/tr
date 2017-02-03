export class Location {

  static EMPTY_LOCATION = new Location('', '');

  static withId(id: number): Location {
    return new Location(null, null, id);
  }

  constructor(public name: string, public city: string, public id?: number) {
  }

}
