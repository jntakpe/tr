import { PageEvent } from './page-event';
import { SortEvent } from './sort-event';

export class PageContext {

  constructor(public pageEvent: PageEvent = new PageEvent(), public sortEvent: SortEvent = null) {
  }

}
