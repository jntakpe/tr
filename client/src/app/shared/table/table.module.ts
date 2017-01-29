import { NgModule } from '@angular/core';
import { FilterTableService } from './filter-table.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [NgxDatatableModule],
  providers: [FilterTableService],
  exports: [NgxDatatableModule]
})
export class TableModule {
}
