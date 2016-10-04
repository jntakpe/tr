import {LayoutComponent} from './layout.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderModule} from './header/header.module';
import {FooterModule} from './footer/footer.module';
import {BreadcrumbsModule} from './breadcrumbs/breadcrumbs.module';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {SecurityModule} from '../../security/security.module';
import {SecurityService} from '../../security/security.service';

describe('layout component', () => {
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [HeaderModule, FooterModule, BreadcrumbsModule, SecurityModule, RouterTestingModule, RouterModule.forChild([])],
      providers: [SecurityService]
    });
    fixture = TestBed.createComponent(LayoutComponent);
  });

  it('should create component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

});
