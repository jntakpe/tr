import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../shared/employee.service';
import { Observable } from 'rxjs';
import { Session } from '../session/session';

@Component({
  selector: 'tr-home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sessions$: Observable<Session[]>;

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.sessions$ = this.employeeService.findSessions();
  }

}
