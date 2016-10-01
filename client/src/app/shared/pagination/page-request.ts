import {URLSearchParams} from '@angular/http';
import {Direction} from './direction';

export class PageRequest<T> {

  constructor(public searchObj?: T, public page = 0, public size = 10, public direction?: Direction, public column?: string) {
  }

  toUrlSearchParams(): URLSearchParams {
    const urlSearchParams = this.pageDataToParams();
    return this.searchObjToParams(urlSearchParams);
  }

  private pageDataToParams(urlSearchParams: URLSearchParams = new URLSearchParams()): URLSearchParams {
    urlSearchParams.set('page', this.page.toString());
    urlSearchParams.set('size', this.size.toString());
    if (this.direction) {
      urlSearchParams.set('direction', Direction[this.direction]);
    }
    if (this.column) {
      urlSearchParams.set('column', this.column);
    }
    return urlSearchParams;
  }

  private searchObjToParams(urlSearchParams: URLSearchParams = new URLSearchParams()): URLSearchParams {
    if (this.searchObj) {
      for (let key of Object.keys(this.searchObj)) {
        if (this.searchObj[key]) {
          urlSearchParams.set(key, this.searchObj[key]);
        }
      }
    }
    return urlSearchParams;
  }

}
