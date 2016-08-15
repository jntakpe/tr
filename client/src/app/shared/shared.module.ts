import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {NavigationService} from './navigation.service';
import {AlertService} from './alert.service';

@NgModule({
  exports: [CommonModule, ReactiveFormsModule, HttpModule, RouterModule],
  providers: [NavigationService, AlertService]
})
export class SharedModule {

}
