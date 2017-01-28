import { Employee } from '../../shared/employee';

export class Trainer extends Employee {

  constructor(login: string, email: string, firstName: string, lastName: string, department: string, location: string, id?: number) {
    super(login, email, firstName, lastName, department, location, id);
  }

}
