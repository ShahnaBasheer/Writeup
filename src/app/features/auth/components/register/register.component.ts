
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { confirmPasswordValidator, isFieldInvalidator } from '../../../../core/validators/forms.validator';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { SideBannerComponent } from "../../../../shared/components/side-banner/side-banner.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    RouterModule, LoaderComponent,
    LoaderComponent, SideBannerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registrationForm!: FormGroup;
  isLoading: boolean = false;
  isEnabled = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      "fullName": ['', Validators.required],
      "work": ['', Validators.required],
      "email": ['', [Validators.required, Validators.email]],
      "password": ['', [Validators.required, Validators.minLength(6)]],
      "confirmPassword": ['', [Validators.required, Validators.minLength(6)]]
      }, { validators: confirmPasswordValidator()
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    return isFieldInvalidator(this.registrationForm, fieldName);
  }

  isConfirmPasswordMismatch() {
    return (
      this.registrationForm.hasError('confirmPasswordMismatch') &&
      this.registrationForm.controls['confirmPassword']?.touched
    );
  }


  onSubmit(): void {
    console.log(this.registrationForm.valid)
    if (this.registrationForm.valid) {
        this.isLoading = true;
        this.isEnabled = false;
        // this.customerAuthService.customerRegistration(this.registrationForm.value).subscribe({
        //   next: (response: any) => {
        //       this.toastr.success('Verification Code has been sent Successfully!');
        //       this.router.navigate(['/otpverification']);
        //   },
        //   error: (error: any) => {
        //     this.isLoading = false;
        //     this.isEnabled = false;
        //     if (error.status === 409) {
        //       this.toastr.warning('You have already signed up. Please log in!');
        //       this.router.navigate(['/login']);
        //     } else {
        //       this.toastr.error(error.error?.message || "An error occurred during registration")
        //     }
        //   },
        //   complete: () => {
        //     this.isLoading = false;
        //   },
        // });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

}
