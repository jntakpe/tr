import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {NavigationService} from './navigation.service';

@NgModule({
  exports: [CommonModule, ReactiveFormsModule, HttpModule, RouterModule],
  providers: [NavigationService]
})
export class SharedModule {

}
