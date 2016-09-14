import {NgModule} from '@angular/core';
import {FilterTableService} from './filter-table.service';
import {Angular2DataTableModule} from 'angular2-data-table';

@NgModule({
  imports: [Angular2DataTableModule],
  providers: [FilterTableService],
  exports: [Angular2DataTableModule]
})
export class TableModule {
}
