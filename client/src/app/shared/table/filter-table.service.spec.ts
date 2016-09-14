import {TestBed, inject} from '@angular/core/testing/test_bed';
import {TableModule} from './table.module';
import {FilterTableService} from './filter-table.service';

describe('filter service', () => {

  const dummyData = [
    {id: 1, firstName: 'Bruce', lastName: 'Wayne'},
    {id: 2, firstName: 'John', lastName: 'Rambo'},
    {id: 3, firstName: 'Clark', lastName: 'Kent'},
    {id: 4, firstName: 'Robin', lastName: 'Hood'}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableModule],
      providers: [FilterTableService]
    });
  });

  it('should filter none cuz no params', inject([FilterTableService], (filterTableService: FilterTableService) => {
  }));

});
