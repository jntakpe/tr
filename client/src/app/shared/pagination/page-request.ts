import {URLSearchParams} from '@angular/http';
import {SortDirection} from 'angular2-data-table';

const flatten = require('flat');

export class PageRequest<T> {

  page: number;

  size: number;

  direction: SortDirection;

  column: string;

  constructor({offset: page = 0, limit: size = 10, sorts}: any, public searchObj?: T) {
    this.page = page;
    this.size = size;
    if (sorts && sorts.length) {
      const {dir, prop} = sorts[0];
      this.direction = dir;
      this.column = prop;
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
