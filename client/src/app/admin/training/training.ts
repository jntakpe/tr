export class Training {

  static EMPTY_TRAINING = new Training('', 0, '', '');

  static withId(id: number): Training {
    return new Training(null, null, null, null, id);
  }

  constructor(public name: string, public duration: number, public domain: string, public icon?: string, public id?: number) {
  }

}
