import {LocationComponent} from './location/location.component';
import {TrainingComponent} from './training/training.component';
import {Route} from '@angular/router';
import {homeRoute} from '../home/home.route';
import {BreadcrumbsInfo} from '../shared/layout/breadcrumbs/breadcrumbs';
import {AdminComponent} from './admin.component';
import {AdminGuard} from './admin-guard.service';
import {TrainerComponent} from './trainer/trainer.component';
import {SessionComponent} from './session/session.component';
import {SessionEditComponent} from './session/edit/session-edit.component';

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

const sessionRoute: Route = {
  path: '',
  component: SessionComponent,
  data: {
    title: 'Sessions',
    breadcrumb: [new BreadcrumbsInfo(homeRoute)]
  }
};

const editSessionRoute: Route = {
  path: ':id',
  component: SessionEditComponent,
  data: {
    title: 'Édition d\'une session',
    breadcrumb: [new BreadcrumbsInfo(homeRoute), new BreadcrumbsInfo(sessionRoute)]
  }
};

const sessionsRoute: Route = {
  path: 'sessions',
  children: [sessionRoute, editSessionRoute]
};

export const adminRoute: Route = {
  path: 'admin',
  canActivateChild: [AdminGuard],
  component: AdminComponent,
  children: [locationRoute, trainingRoute, trainerRoute, sessionsRoute]
};
