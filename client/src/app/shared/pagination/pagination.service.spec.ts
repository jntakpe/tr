import {TestBed, inject} from '@angular/core/testing';
import {PaginationService} from './pagination.service';
import {Page} from './page';
describe('pagination service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginationService]
    });
  });

  it('should reIndexContent not modifying underlying array', inject([PaginationService], (paginationService: PaginationService) => {
    const array: Array<string> = Array.from(new Array(10).keys(), val => 'val' + val);
    const page = new Page(array, 1, 10, true, false, 10, 10, null, 0);
    const reIndexedContent = paginationService.reIndexContent(page);
    expect(reIndexedContent.content.length).toBe(10);
  }));

  it('should reIndexContent shifting content', inject([PaginationService], (paginationService: PaginationService) => {
    const array: Array<string> = Array.from(new Array(10).keys(), val => 'val' + val);
    const page = new Page(array, 1, 10, true, false, 10, 10, null, 1);
    const reIndexedContent = paginationService.reIndexContent(page);
    expect(reIndexedContent.content.length).toBe(20);
    expect(reIndexedContent.content[0]).toBeFalsy();
    expect(reIndexedContent.content[9]).toBeFalsy();
    expect(reIndexedContent.content[10]).toBe('val0');
    expect(reIndexedContent.content[19]).toBe('val9');
  }));

});
