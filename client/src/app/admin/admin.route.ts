import { LocationComponent } from './location/location.component';
import { TrainingComponent } from './training/training.component';
import { Route } from '@angular/router';
import { homeRoute } from '../home/home.route';
import { BreadcrumbsInfo } from '../shared/layout/breadcrumbs/breadcrumbs';
import { AdminComponent } from './admin.component';
import { AdminGuard } from './admin-guard.service';
import { TrainerComponent } from './trainer/trainer.component';
import { SessionEditComponent } from './session/edit/session-edit.component';
import { SessionComponent } from './session/session.component';

export function homeBreadcrumb(): BreadcrumbsInfo {
  return new BreadcrumbsInfo(homeRoute);
}
const locationRoute: Route = {
  path: 'locations',
  component: LocationComponent,
  data: {
    title: 'Sites de formation',
    breadcrumb: [homeBreadcrumb]
  }
};

const trainingRoute: Route = {
  path: 'trainings',
  component: TrainingComponent,
  data: {
    title: 'Formations',
    breadcrumb: [homeBreadcrumb]
  }
};

const trainerRoute: Route = {
  path: 'trainers',
  component: TrainerComponent,
  data: {
    title: 'Formateurs',
    breadcrumb: [homeBreadcrumb]
  }
};

const sessionsRoute: Route = {
  path: 'sessions',
  component: SessionComponent,
  data: {
    title: 'Sessions',
    breadcrumb: [homeBreadcrumb],
    absolutePath: '/admin/sessions'
  }
};

export function sessionsBreadcrumb(): BreadcrumbsInfo {
  return new BreadcrumbsInfo(sessionsRoute);
}

const editSessionRoute: Route = {
  path: 'sessions/:id',
  component: SessionEditComponent,
  data: {
    title: 'Édition d\'une session',
    breadcrumb: [homeBreadcrumb, sessionsBreadcrumb]
  }
};

const addSessionRoute: Route = {
  path: 'session/',
  component: SessionEditComponent,
  data: {
    title: 'Ajout d\'une session',
    breadcrumb: [homeBreadcrumb, sessionsBreadcrumb]
  }
};

export const adminRoute: Route = {
  path: 'admin',
  canActivateChild: [AdminGuard],
  component: AdminComponent,
  children: [locationRoute, trainingRoute, trainerRoute, sessionsRoute, editSessionRoute, addSessionRoute]
};
