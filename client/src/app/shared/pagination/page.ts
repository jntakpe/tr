export class Page<T> {

  constructor(public content: T[],
              public totalPages: number,
              public totalElements: number,
              public first: boolean,
              public last: boolean,
              public size: number,
              public numberOfElements: number,
              public sort: string,
              public number: number) {
  }
}
