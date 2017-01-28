import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface SessionSearchForm {
  start: NgbDateStruct;
  trainingName: string;
  trainingDomain: string;
  locationName: string;
  locationCity: string;
  firstName: string;
  lastName: string;
}
