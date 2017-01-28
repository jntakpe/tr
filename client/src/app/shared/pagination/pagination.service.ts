import { Injectable } from '@angular/core';
import { Page } from './page';

@Injectable()
export class PaginationService {

  constructor() {
  }

  reIndexContent<T>(page: Page<T>): Page<T> {
    const start = page.number * page.size;
    const reIndexed: T[] = [];
    page.content.forEach((value, idx) => {
      reIndexed[start + idx] = value;
    });
    page.content = reIndexed;
    return page;
  }

}
