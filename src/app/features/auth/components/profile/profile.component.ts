import { Component, EventEmitter, Output } from '@angular/core';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';
import { isFieldInvalidator } from '../../../../core/validators/forms.validator';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EditProfileModalComponent } from '../../../../shared/components/edit-profile-modal/edit-profile-modal.component';
import { AuthService } from '../../../../core/services/auth.service';
import { PageLoaderComponent } from '../../../../shared/components/page-loader/page-loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ LoaderComponent, CommonModule,
      EditProfileModalComponent,ReactiveFormsModule, PageLoaderComponent ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showChangePassword = false;
  changePasswordForm!: FormGroup;
  profileInfo: User | null = null;
  showEditProfileModal: boolean = false;
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  isLoading: boolean = true;
  showOtpModal = false;
  showEmailModal = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    const routePath = this.router.url;
    this.loadProfilePage();

    // Initialize the reactive form
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      // Custom validator to match new password and confirm password
      validators: this.passwordsMatchValidator
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Initialize the OTP form
    this.otpForm = this.fb.group({
      otpOld: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      otpNew: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

 loadProfilePage(): void {
    this.authservice.getProfilePage().subscribe({
      next: (response) => {
        this.profileInfo = response.data?.profile as User;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile page:', error);
        this.isLoading = false;
      }
    });
  }


  isFieldInvalid(fieldgroup: FormGroup, fieldName: string): boolean {
    return isFieldInvalidator(fieldgroup, fieldName);
  }


  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword && confirmNewPassword && newPassword !== confirmNewPassword
      ? { passwordsMismatch: true }
      : null;
  }

  toggleEditProfileModal() {
    this.showEditProfileModal = !this.showEditProfileModal;
  }

  toggleEditMailModal() {
    this.showEmailModal = !this.showEmailModal;
    this.emailForm.reset();
  }

  onSaveProfile() {
    this.toggleEditProfileModal();
  }


  closeOtpModal() {
    this.showOtpModal = false;
  }

  onEditedProfile(data: User){
    this.profileInfo = data;
    this.showEditProfileModal = false;
  }

  onCancelEmailModal(){
    this.showEmailModal = false;
  }

  verifyOtp() {
    console.log("clicked", this.otpForm.value)
    if (this.otpForm.valid) {
      this.isLoading = true;

      this.authservice.verifyOTPForEmail(this.otpForm.value).subscribe({
        next: (res) => {
          console.log(res.data.profile, "bhhghhh")
          this.profileInfo = res.data?.profile;
          this.showOtpModal = false;
          this.isLoading = false;
          this.toastr.success("Email has been successfully changed!");
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err.error.message,'Error in verify OTP');
          this.toastr.error(err.error.message);
        }
      })
    } else {
      // Handle error if OTP fields are empty or invalid
      this.otpForm.markAllAsTouched();
    }
  }

  toggleChangePassword(){
     this.showChangePassword = !this.showChangePassword;
  }

  onSubmitPassword(){
    if(this.changePasswordForm.valid){
        this.isLoading = true;

        this.authservice.passwordChange(this.changePasswordForm.value).subscribe({
          next: (res) => {
            this.toastr.success("Password has been Successfully Changed");
            this.showChangePassword = false;
            this.isLoading = false;
          },
          error: (err) => {
            console.log(err);
            this.toastr.error(err.error?.message ?? "Something went wrong. Please try again.");
            this.isLoading = false;
          }
        })
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  onChangeEmail(){
    const newEmail = this.emailForm.get('email')?.value;

    if(!this.emailForm.valid){
      this.emailForm.markAllAsTouched();
      return;
    }

    if (this.profileInfo?.email !== newEmail && this.emailForm.valid) {
      this.isLoading = true;
      this.authservice.sendOtpForEmail(newEmail).subscribe({
        next: (res) => {
            this.toastr.success(res?.message);
            this.otpForm.patchValue({ email : res?.data?.email || newEmail})
            this.isLoading = false;
            this.showEmailModal = false;
            this.showOtpModal = true;
        },
        error: (err) => {
            this.toastr.error(err.error?.message || 'Something went wrong!');
            this.isLoading = false;
        }
      });
    } else {
      this.emailForm.markAllAsTouched();
    }
  }
}
