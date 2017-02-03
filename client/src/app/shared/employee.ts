export class Employee {

  static withId(id: number): Employee {
    return new Employee(null, null, null, null, null, null, id);
  }

  constructor(public login: string,
              public email: string,
              public firstName: string,
              public lastName: string,
              public department: string,
              public location: string,
              public id?: number) {
  }

}
