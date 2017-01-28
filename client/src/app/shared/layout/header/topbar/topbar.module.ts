import { NgModule } from '@angular/core';
import { TopbarComponent } from './topbar.component';
import { TopbarService } from './topbar.service';

@NgModule({
  declarations: [TopbarComponent],
  exports: [TopbarComponent],
  providers: [TopbarService]
})
export class TopbarModule {

}
