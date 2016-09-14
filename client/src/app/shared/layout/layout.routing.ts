import {Routes, RouterModule, Route} from '@angular/router';
import {HomeComponent} from '../../home/home.component';
import {LocationComponent} from '../../admin/location/location.component';
import {BreadcrumbsInfo} from '../../shared/layout/breadcrumbs/breadcrumbs';
import {LayoutComponent} from '../../shared/layout/layout.component';
import {TrainingComponent} from '../../admin/training/training.component';

const homeRoute: Route = {
  path: 'home',
  component: HomeComponent,
  data: {
    title: 'Accueil',
    breadcrumb: []
  }
};

const locationRoute: Route = {
  path: 'locations',
  component: LocationComponent,
  data: {
    title: 'Sites de formation',
    breadcrumb: [new BreadcrumbsInfo(homeRoute)]
  }
};

const trainingRoute: Route = {
  path: 'trainings',
  component: TrainingComponent,
  data: {
    title: 'Formations',
    breadcrumb: [new BreadcrumbsInfo(homeRoute)]
  }
};

const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      homeRoute,
      locationRoute,
      trainingRoute
    ]
  }
];

export const layoutRouting = RouterModule.forChild(layoutRoutes);
