import {Routes, RouterModule, Route} from '@angular/router';
import {HomeComponent} from '../../home/home.component';
import {LayoutComponent} from '../../shared/layout/layout.component';
import {adminRoute} from '../../admin/admin.route';

const homeRoute: Route = {
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
      homeRoute,
      adminRoute
    ]
  }
];

export const layoutRouting = RouterModule.forChild(layoutRoutes);
