import {TestBed, inject} from '@angular/core/testing/test_bed';
import {TopbarComponent} from './topbar.component';
import {TopbarService} from './topbar.service';
import {async} from '@angular/core/testing/async';
describe('topbar component', () => {

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
  });

  it('should intialize user infos', async(() => {
    const fixture = TestBed.createComponent(TopbarComponent);
    fixture.detectChanges();
    const component = fixture.debugElement.componentInstance;
    expect(component.username).toBe('jntakpe');
    expect(component.authorities).toBe('Administrateur | Formateur');
  }));

  it('should display username', async(() => {
    const fixture = TestBed.createComponent(TopbarComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.loginbar li:first-child a').textContent).toBe('jntakpe');
  }));

  it('should display authorities', async(() => {
    const fixture = TestBed.createComponent(TopbarComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.loginbar li:nth-child(3) a').textContent).toBe('Administrateur | Formateur');
  }));

  it('should call logout', async(inject([TopbarService], (topbarService: TopbarService) => {
    const fixture = TestBed.createComponent(TopbarComponent);
    fixture.detectChanges();
    spyOn(topbarService, 'logout');
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('.loginbar li:last-child a').click();
    fixture.detectChanges();
    expect(topbarService.logout).toHaveBeenCalled();
  })));

});
