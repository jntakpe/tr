import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from '../../home/home.component';
import {LayoutComponent} from './layout.component';

const homeRoute = {
  path: 'home',
  component: HomeComponent,
  data: {
    title: 'Accueil',
    breadcrumb: []
  }
};

const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      homeRoute
    ]
  }
];

export const layoutRouting = RouterModule.forChild(layoutRoutes);
