import { TestBed, inject, async } from '@angular/core/testing';
import { TopbarComponent } from './topbar.component';
import { TopbarService } from './topbar.service';
import { ComponentFixture } from '@angular/core/testing/component_fixture';

describe('topbar component', () => {

  let fixture: ComponentFixture<TopbarComponent>;

  class MockTopbarService extends TopbarService {

    getUserInfos(): any {
      return {
        username: 'jntakpe',
        authorities: 'Administrateur | Formateur'
      };
    }

    logout(): void {
      // do nothing
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopbarComponent],
      providers: [{provide: TopbarService, useValue: new MockTopbarService(null, null)}]
    });
    fixture = TestBed.createComponent(TopbarComponent);
  });

  it('should intialize user infos', async(() => {
    fixture.detectChanges();
    const component = fixture.debugElement.componentInstance;
    expect(component.username).toBe('jntakpe');
    expect(component.authorities).toBe('Administrateur | Formateur');
  }));

  it('should display username', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.loginbar li:first-child a').textContent).toBe('jntakpe');
  }));

  it('should display authorities', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.loginbar li:nth-child(3) a').textContent).toBe('Administrateur | Formateur');
  }));

  it('should call logout', async(inject([TopbarService], (topbarService: TopbarService) => {
    fixture.detectChanges();
    spyOn(topbarService, 'logout');
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('.loginbar li:last-child a').click();
    fixture.detectChanges();
    expect(topbarService.logout).toHaveBeenCalled();
  })));

});
