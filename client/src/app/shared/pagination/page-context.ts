import { PageEvent } from './page-event';
import { Sort } from './sort';

export class PageContext {

  constructor(public pageEvent: PageEvent = new PageEvent(), public sort: Sort = null) {
  }

}
