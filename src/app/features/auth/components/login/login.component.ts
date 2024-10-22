import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isFieldInvalidator } from '../../../../core/validators/forms.validator';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { SideBannerComponent } from '../../../../shared/components/side-banner/side-banner.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
    SideBannerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    return isFieldInvalidator(this.loginForm, fieldName);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authservice.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastr.success(res.message);
          this.router.navigate(['/dashboard']);

        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.toastr.error(err.error?.message ?? "Something went wrong.Please try later!");
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
