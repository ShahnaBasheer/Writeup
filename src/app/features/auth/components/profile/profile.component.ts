import { Component } from '@angular/core';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';
import { isFieldInvalidator } from '../../../../core/validators/forms.validator';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EditProfileModalComponent } from '../../../../shared/components/edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ LoaderComponent, CommonModule,
      EditProfileModalComponent,ReactiveFormsModule ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showChangePassword = false;
  changePasswordForm!: FormGroup;
  profileInfo!: User;
  showEditProfileModal: boolean = false;
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  isLoading: boolean = true;
  isEditing: boolean = false;
  showOtpModal = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const routePath = this.router.url;
    this.loadProfilePage(routePath);

    // Initialize the reactive form
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
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

 loadProfilePage(url: string): void {
    // this.customerService.getProfilePage().subscribe({
    //   next: (response) => {
    //     console.log(response, "res")
    //     this.profileInfo = response.data?.customerDetail;
    //     this.emailForm.patchValue({
    //       email: this.profileInfo.email
    //     });
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading profile page:', error);
    //     this.isLoading = false;
    //   }
    // });
  }


  isFieldInvalid(fieldgroup: FormGroup, fieldName: string): boolean {
    return isFieldInvalidator(fieldgroup, fieldName);
  }


  // Handle the form submission
  onSubmitChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.changePasswordForm.value;

  }

  // Custom validator to check if new password and confirm new password match
  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword && confirmNewPassword && newPassword !== confirmNewPassword
      ? { passwordsMismatch: true }
      : null;
  }

  // Placeholder for forgot password action
  forgotPassword(): void {
    // Handle forgot password action here
    console.log('Forgot Password clicked');
  }

  // Toggle the visibility of the edit profile modal
  toggleEditProfileModal() {
    this.showEditProfileModal = !this.showEditProfileModal;
  }

  // Handle save profile details
  onSaveProfile(updatedProfile: any) {
    console.log('Updated Profile:', updatedProfile);
    this.toggleEditProfileModal();
  }

  onEmailChange() {
    this.isEditing = true;
  }

   // When "Save" button is clicked
  saveEmail() {
    console.log(this.emailForm.get('email')?.value);
    const newEmail = this.emailForm.get('email')?.value;

    if(!this.emailForm.valid){
      this.emailForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (newEmail !== this.profileInfo.email && this.emailForm.valid) {
      // this.customerService.sendOtpForEmail(newEmail).subscribe({
      //   next: (res) => {
      //       console.log(res, "response");
      //       this.toastr.success('OTP has been sent Succesfully!');
      //       this.otpForm.patchValue({
      //         email: newEmail
      //       });
      //       this.isLoading = false;
      //       this.showOtpModal = true;
      //   },
      //   error: (err) => {
      //       console.log(err.error.message, "error in sending OTP");
      //       this.toastr.error(err.error.message);
      //       this.isLoading = false;
      //   }
      // });


    } else {
      this.isEditing = false;
    }
  }

  // When "Cancel" button is clicked
  cancelEdit() {
    this.isEditing = false;
  }

  // Close the OTP modal
  closeOtpModal() {
    this.showOtpModal = false;
  }

  // OTP verification logic (this should integrate with backend API)
  verifyOtp() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      // this.customerService.verifyOTPForEmail(this.otpForm.value).subscribe({
      //   next: (res) => {
      //     console.log(res,"jbfhdfjjb");
      //     this.profileInfo = res.data.customerDetail;
      //     this.isEditing = false;
      //     this.showOtpModal = false;
      //     this.isLoading = false;
      //     this.toastr.success("Email has been successfully changed!");
      //   },
      //   error: (err) => {
      //     this.isLoading = false;
      //     console.log(err.error.message,'Error in verify OTP');
      //     this.toastr.error(err.error.message);
      //   }
      // })
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
        // this.customerService.passwordChange(this.changePasswordForm.value).subscribe({
        //   next: (res) => {
        //     this.toastr.success("Password has been Successfully Changed");
        //     this.showChangePassword = false;
        //     this.isLoading = false;
        //   },
        //   error: (err) => {
        //     console.log(err);
        //     this.toastr.error(err.error.message);
        //     this.isLoading = false;
        //   }
        // })
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  onEditedProfile(data: User){
    this.profileInfo = data;
  }
}
