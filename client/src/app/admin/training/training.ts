export class Training {

  static EMPTY_TRAINING = new Training('', 0, '');

  constructor(public name: String, public duration: number, public domain: string, public id?: number) {
  }

}
