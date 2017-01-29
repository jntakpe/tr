import { URLSearchParams } from '@angular/http';
import { PageContext } from './page-context';
import { SortDirection } from '@swimlane/ngx-datatable';

const flatten = require('flat');

export class PageRequest<T> {

  page: number;

  size: number;

  direction: string;

  column: string;

  constructor({pageEvent: {offset, limit}, sort}: PageContext, public searchObj?: T) {
    this.page = offset;
    this.size = limit;
    if (sort) {
      this.column = sort.prop;
      this.direction = sort.dir;
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
