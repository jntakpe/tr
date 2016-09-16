import {TestBed} from '@angular/core/testing';
import {HeaderComponent} from './header.component';
import {ComponentFixture} from '@angular/core/testing/component_fixture';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing/router_testing_module';
import {NavbarModule} from './navbar/navbar.module';
import {TopbarModule} from './topbar/topbar.module';
import {SecurityModule} from '../../../security/security.module';

describe('header component', () => {

  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [NavbarModule, TopbarModule, SecurityModule, RouterTestingModule, RouterModule.forChild([])]
    });
    fixture = TestBed.createComponent(HeaderComponent);
  });

  it('should create component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

});
