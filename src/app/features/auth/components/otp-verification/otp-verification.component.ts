import { Component } from '@angular/core';
import { SideBannerComponent } from '../../../../shared/components/side-banner/side-banner.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { isFieldInvalidator } from '../../../../core/validators/forms.validator';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [SideBannerComponent, ReactiveFormsModule,
    CommonModule, RouterModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css',
})

export class OtpVerificationComponent {
  email: string = '';
  otpVerificationForm!: FormGroup;
  countdownIntervalId!: any;
  countdown!: string;
  isLoading: boolean = false;
  isEnabled: boolean = false;
  isTimerEnabled: boolean = false;
  resendOtpCount: number = 3;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.otpVerificationForm = this.fb.group({
      otp: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  ngOnInit(): void {
    // this.authService.email$.subscribe(email => {
    //   this.email = email ;
    //   this.startCountdown();
    // });
  }

  isFieldInvalid(fieldName: string): boolean {
    return isFieldInvalidator(this.otpVerificationForm, fieldName);
  }

  onSubmit() {
    if (this.otpVerificationForm.valid) {
      // this.isLoading = true;
      // this.isEnabled = false;
      // this.authService.verifyOTP(this.email, this.otpVerificationForm.value.otp).subscribe({
      //   next: (response) => {
      //     this.toastr.success("Verified Otp Successfully!Please Login!", 'Success');
      //     this.router.navigate(['/login']);
      //   },
      //   error: (error) => {
      //     this.isLoading = false;
      //     this.isEnabled = true;
      //     this.toastr.error(error.error.message || 'An error occurred during OTP verification.', 'Failed');
      //   },
      //   complete: () => {
      //     this.isLoading = false;
      //     this.isEnabled = true;
      //   },
      // });
    } else {
      this.otpVerificationForm.markAllAsTouched();
    }
  }

  startCountdown(): void {
    let totalSeconds = 120; // 2 minutes
    this.countdownIntervalId = setInterval(() => {
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
    // this.authService.resendOTP(this.email).subscribe({
    //   next: (response: any) => {
    //     this.resendOtpCount = parseInt(response?.data?.remainingLimit);
    //     clearInterval(this.countdownIntervalId)
    //     this.isTimerEnabled = true;
    //     this.startCountdown();
    //     if(response){
    //       this.toastr.success("Resend  Otp Successfully!", 'Success');
    //     }
    //   },
    //   error: (error: any) => {
    //     if (error.status === 409) {
    //       this.toastr.error("You have already signed up!", 'Failed');
    //       this.router.navigate(['/login']);
    //     } else {
    //       console.log(error,"errors from signupcomponent")
    //       this.toastr.error(error.error.message || 'An error occurred during registration', 'Failed');
    //     }
    //   }
    // })
  }
}
