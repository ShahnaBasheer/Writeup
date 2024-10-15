import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


function confirmPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Check if the password and confirmPassword fields have values and if they match
    if (password !== confirmPassword) {
      return { confirmPasswordMismatch: true };
    }
    return null;
  };
}


function isFieldInvalidator(formGroup: FormGroup, fieldName: string): boolean {
  return (
    (formGroup?.controls[fieldName]?.touched || formGroup?.controls[fieldName]?.dirty) &&
    formGroup?.controls[fieldName]?.invalid
  );
}

export {
  confirmPasswordValidator,
  isFieldInvalidator
}
