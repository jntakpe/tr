import { TestBed, inject, fakeAsync } from '@angular/core/testing';
import { FormModule } from './form.module';
import { FormService } from './form.service';
import { Validators } from '@angular/forms';
import { FormField } from './form-field';

describe('form service', () => {

  const formConfig = {
    f1: new FormField(['f1', Validators.required], {
      required: 'Le champ f1 est requis'
    }),
    f2: new FormField(['f2', [Validators.required, Validators.minLength(2)]], {
      required: 'Le champ f2 est requis',
      minlength: 'Le champ f2 doit avoir une longueur de 2 minimum'
    })
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormModule],
      providers: [FormService]
    });
  });

  it('should create form group', inject([FormService], (formService: FormService) => {
    const formGroup = formService.buildValidationForm(formConfig).formGroup;
    expect(formGroup).toBeTruthy();
    expect(formGroup.controls['f1']).toBeTruthy();
    expect(formGroup.controls['f1'].value).toBe('f1');
  }));

  it('should create messages', inject([FormService], (formService: FormService) => {
    const messages = formService.buildValidationForm(formConfig).messages;
    expect(messages).toBeTruthy();
    expect(messages['f1']).toBeTruthy();
    expect(messages['f1']['required']).toBe('Le champ f1 est requis');
  }));

  it('should validate form without error', fakeAsync(inject([FormService], (formService: FormService) => {
    const formMessages = formService.buildValidationForm(formConfig);
    let errors;
    formMessages.formGroup.valueChanges.subscribe(d => errors = formService.validate(d, formMessages));
    formMessages.formGroup.setValue({f1: 'Test', f2: 'Test'});
    expect(errors).toBeTruthy();
    expect(errors.f1).toBeFalsy();
    expect(errors.f2).toBeFalsy();
  })));

  it('should validate form with error cuz f1 required', fakeAsync(inject([FormService], (formService: FormService) => {
    const formMessages = formService.buildValidationForm(formConfig);
    let errors;
    formMessages.formGroup.valueChanges.subscribe(d => errors = formService.validate(d, formMessages));
    formMessages.formGroup.controls['f1'].markAsDirty(true);
    formMessages.formGroup.setValue({f1: '', f2: 'Test'});
    expect(errors).toBeTruthy();
    expect(errors.f1).toBeTruthy();
    expect(errors.f1).toBe('Le champ f1 est requis');
    expect(errors.f2).toBeFalsy();
  })));

  it('should validate form with error cuz f2 required', fakeAsync(inject([FormService], (formService: FormService) => {
    const formMessages = formService.buildValidationForm(formConfig);
    let errors;
    formMessages.formGroup.valueChanges.subscribe(d => errors = formService.validate(d, formMessages));
    formMessages.formGroup.controls['f2'].markAsDirty(true);
    formMessages.formGroup.setValue({f1: 'sdf', f2: ''});
    expect(errors).toBeTruthy();
    expect(errors.f1).toBeFalsy();
    expect(errors.f2).toBe('Le champ f2 est requis');
    expect(errors.f2).toBeTruthy();
  })));

  it('should validate form with error cuz f2 minlength', fakeAsync(inject([FormService], (formService: FormService) => {
    const formMessages = formService.buildValidationForm(formConfig);
    let errors;
    formMessages.formGroup.valueChanges.subscribe(d => errors = formService.validate(d, formMessages));
    formMessages.formGroup.controls['f2'].markAsDirty(true);
    formMessages.formGroup.setValue({f1: 'sdf', f2: 's'});
    expect(errors).toBeTruthy();
    expect(errors.f1).toBeFalsy();
    expect(errors.f2).toBe('Le champ f2 doit avoir une longueur de 2 minimum');
    expect(errors.f2).toBeTruthy();
  })));

});
