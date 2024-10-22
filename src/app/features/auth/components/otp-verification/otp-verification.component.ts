import { Component } from '@angular/core';
import { SideBannerComponent } from '../../../../shared/components/side-banner/side-banner.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { isFieldInvalidator } from '../../../../core/validators/forms.validator';
import { AuthService } from '../../../../core/services/auth.service';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { Subscription } from 'rxjs';
import { TokenService } from '../../../../core/services/token.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [SideBannerComponent, ReactiveFormsModule,
    CommonModule, RouterModule,
    LoaderComponent
  ],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css',
})

export class OtpVerificationComponent {
  email: string = '';
  otpVerificationForm!: FormGroup;
  countdownIntervalId!: number;
  countdown!: string;
  isLoading: boolean = false;
  isEnabled: boolean = true;
  isTimerEnabled: boolean = true;
  resendOtpCount: number = 3;
  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService,
    private tokenservice: TokenService
  ) {
    this.otpVerificationForm = this.fb.group({
      otp: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Check if the user is navigating away from the OTP verification page
        if (event.url !== '/otp-verification') {
          // Remove the verification token
          this.tokenservice.removeToken(environment.verifyemail);
        }
      }
    });
  }

  ngOnInit(): void {
    this.authservice.email$.subscribe(email => {
      this.email = email ;
      this.startCountdown();
    });

  }

  isFieldInvalid(fieldName: string): boolean {
    return isFieldInvalidator(this.otpVerificationForm, fieldName);
  }

  onSubmit() {
    console.log("clicked")
    if (this.otpVerificationForm.valid) {
      this.isLoading = true;
      this.isEnabled = false;
      this.authservice.verifyOTP(this.email, this.otpVerificationForm.value.otp).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.isEnabled = true;
          this.toastr.error(error.error?.message ?? 'Something went wrong!');
        },
        complete: () => {
          this.isLoading = false;
          this.isEnabled = true;
        },
      });
    } else {
      this.otpVerificationForm.markAllAsTouched();
    }
  }

  startCountdown(): void {
    let totalSeconds = 120; // 2 minutes
    this.countdownIntervalId = window.setInterval(() => {
      totalSeconds--;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      this.countdown = `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
      if (totalSeconds <= 0) {
        clearInterval(this.countdownIntervalId);
        this.countdown = '00:00';
      }
    }, 1000);
  }

  onResendOTP(): void {
    this.isTimerEnabled = false;
    this.authservice.resendOTP(this.email).subscribe({
      next: (res) => {
        this.resendOtpCount = res?.data?.remainingLimit;
        clearInterval(this.countdownIntervalId)
        this.isTimerEnabled = true;
        this.startCountdown();
        this.toastr.success(res.message);
      },
      error: (error) => {
        if (error.status === 409) {
          this.toastr.error("You have already signed up!", 'Failed');
          this.router.navigate(['/login']);
        } else {
          console.log(error,"errors from signupcomponent")
          this.toastr.error(error.error?.message ?? 'Something went wrong. Try later!');
        }
      }
    })
  }
}
