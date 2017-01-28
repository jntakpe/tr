import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
describe('admin component', () => {

  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [RouterTestingModule, RouterModule.forChild([])]
    });
    fixture = TestBed.createComponent(AdminComponent);
  });

  it('should create component', async(() => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  }));

});
