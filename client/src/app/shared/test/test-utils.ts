import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { tick, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockConnection } from '@angular/http/testing';
import { ResponseOptions, Response } from '@angular/http';
import * as _ from 'lodash';
import { SecurityService } from '../../security/security.service';

export const tokenJson = require('./token-response.json');

export function mockTokenResponse(connection: MockConnection) {
  let valid: boolean = connection.request.getBody().indexOf('username=jntakpe&password=test') !== -1;
  expect(connection.request.url).toEqual('oauth/token');
  connection.mockRespond(new Response(valid ? new ResponseOptions({body: _.cloneDeep(tokenJson)}) : new ResponseOptions({status: 400})));
}

export function mockRefreshTokenResponse(connection: MockConnection) {
  expect(connection.request.getBody()).toContain('grant_type=refresh_token');
  expect(connection.request.getBody()).toContain('refresh_token=');
  connection.mockRespond(new Response(new ResponseOptions({body: _.cloneDeep(tokenJson)})));
}

export class MockSecurityService extends SecurityService {

  isTokenStillValid(token = this.getToken()): boolean {
    return true;
  }

  getToken(): any {
    return {access_token: 'fake'};
  }

}

@Component({
  selector: 'root-cmp',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {
}

@Component({
  selector: 'home-cmp',
  template: '<h1>home</h1>'
})
export class FakeHomeComponent {

}

@Component({
  selector: 'fake-login-cmp',
  template: '<h1>fake cmp</h1>'
})
export class FakeLoginComponent {
}

@Component({
  selector: 'fake-feat-cmp',
  template: '<h1>feat cmp</h1>'
})
export class FakeFeatureComponent {

}

export function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

export function createRoot(router: Router, type: any): ComponentFixture<any> {
  const f = TestBed.createComponent(type);
  advance(f);
  router.initialNavigation();
  advance(f);
  return f;
}
