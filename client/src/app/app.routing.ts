import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';

const routes: Routes = [
  {path: '', component: LayoutComponent}
];

export const appRouting = RouterModule.forRoot(routes);
