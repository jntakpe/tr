import { URLSearchParams } from '@angular/http';
import { SortDirection } from 'angular2-data-table';
import { PageContext } from './page-context';

const flatten = require('flat');

export class PageRequest<T> {

  page: number;

  size: number;

  direction: string;

  column: string;

  constructor({pageEvent: {offset, limit}, sortEvent}: PageContext, public searchObj?: T) {
    this.page = offset;
    this.size = limit;
    if (sortEvent) {
      this.column = sortEvent.prop;
      this.direction = sortEvent.dir;
    }
  }

  toUrlSearchParams(): URLSearchParams {
    const urlSearchParams = this.pageDataToParams();
    return this.searchObjToParams(urlSearchParams);
  }

  private pageDataToParams(urlSearchParams: URLSearchParams = new URLSearchParams()): URLSearchParams {
    urlSearchParams.set('page', this.page.toString());
    urlSearchParams.set('size', this.size.toString());
    if (this.direction) {
      urlSearchParams.set('direction', SortDirection[this.direction]);
    }
    if (this.column) {
      urlSearchParams.set('column', this.column);
    }
    return urlSearchParams;
  }

  private searchObjToParams(urlSearchParams: URLSearchParams = new URLSearchParams()): URLSearchParams {
    if (this.searchObj) {
      const flatSearch = flatten(this.searchObj);
      Object.keys(flatSearch).forEach(key => {
        if (flatSearch[key]) {
          urlSearchParams.set(key, flatSearch[key]);
        }
      });
    }
    return urlSearchParams;
  }

}
