import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './security/login/login.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent}
];

export const appRouting = RouterModule.forRoot(routes);
