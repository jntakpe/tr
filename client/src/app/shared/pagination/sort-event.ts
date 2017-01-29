import { Sort } from './sort';

export class SortEvent {

  sorts: Sort[];

  toSort(): Sort {
    if (this.sorts && this.sorts.length) {
      return this.sorts[0];
    }
  }

}
