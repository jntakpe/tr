import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent}
];

export const securityRouting = RouterModule.forRoot(routes);
