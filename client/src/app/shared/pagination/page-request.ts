import {URLSearchParams} from '@angular/http';
import {Direction} from './direction';

export class PageRequest {

  constructor(public page = 0, public size = 20, public direction?: Direction, public column?: string) {
    if (page) {
      this.page = page - 1;
    }
  }

  toUrlSearchParams(): URLSearchParams {
    const urlSearchParams = new URLSearchParams();
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

}
