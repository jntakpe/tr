import {Component} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing/component_fixture';
import {tick} from '@angular/core/testing/fake_async';
import {Router} from '@angular/router';
import {TestBed} from '@angular/core/testing/test_bed';
import {MockConnection} from '@angular/http/testing/mock_backend';
import {ResponseOptions, Response} from '@angular/http';

export const tokenJson = require('./token-response.json');

export function mockTokenResponse(connection: MockConnection) {
  let valid: boolean = connection.request.getBody().indexOf('username=jntakpe&password=test') !== -1;
  expect(connection.request.url).toEqual('oauth/token');
  connection.mockRespond(new Response(valid ? new ResponseOptions({body: tokenJson}) : new ResponseOptions({status: 400})));
}

@Component({
  selector: 'root-cmp',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {
}

@Component({
  selector: 'fake-login-cmp',
  template: '<h1>fake cmp</h1>'
})
export class FakeLoginComponent {
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
