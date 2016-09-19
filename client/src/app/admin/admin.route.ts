import {LocationComponent} from './location/location.component';
import {TrainingComponent} from './training/training.component';
import {Route} from '@angular/router';
import {homeRoute} from '../home/home.route';
import {BreadcrumbsInfo} from '../shared/layout/breadcrumbs/breadcrumbs';
import {AdminComponent} from './admin.component';
import {AdminGuard} from './admin-guard.service';
import {TrainerComponent} from './trainer/trainer.component';

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

const trainerRoute: Route = {
  path: 'trainers',
  component: TrainerComponent,
  data: {
    title: 'Formateurs',
    breadcrumb: [new BreadcrumbsInfo(homeRoute)]
  }
};


export const adminRoute: Route = {
  path: 'admin',
  canActivateChild: [AdminGuard],
  component: AdminComponent,
  children: [locationRoute, trainingRoute, trainerRoute]
};
