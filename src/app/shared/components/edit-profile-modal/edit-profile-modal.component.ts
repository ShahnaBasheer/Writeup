import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isFieldInvalidator } from '../../../core/validators/forms.validator';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.css'
})
export class EditProfileModalComponent {
  @Input() isOpen: boolean = false;
  @Input() profileInfo!: User;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  showOtpModal: boolean = false;

  @Output() profileEmitter = new EventEmitter<User>();


  editProfileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.editProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.pattern('^[0-9]{10}$')]],
    });
  }

  ngOnChanges() {
    if (this.profileInfo) {
      this.editProfileForm.patchValue(this.profileInfo);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    return isFieldInvalidator(this.editProfileForm, fieldName);
  }

  closeModal() {
    this.close.emit();
  }

  onSave() {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAsTouched();
      return;
    }

    // if (this.profileInfo.role === 'vendor') {
    //   // Perform the PATCH request to update the profile
    //   this.commonService.updateProfile(this.editProfileForm.value).subscribe({
    //     next: (res) => {
    //       // Handle success
    //       console.log('Profile updated successfully', res);
    //       const vendorDetail = res.data?.vendorDetail;
    //       let token = this.tokenservice.getToken(environment.vn_accessKey) || '';
    //       if(res.data?.token){
    //          token = res.data?.token;
    //       }
    //       const user = { ...res.data?.user,
    //         firstName: vendorDetail.firstName,
    //         lastName: vendorDetail.lastName,
    //         email: vendorDetail.email
    //        };

    //       this.profileEmitter.emit(res.data?.vendorDetail)
    //       this.store.dispatch(vendorLoginSuccess({user: user, token}));
    //       this.toastr.success('Profile updated successfully');
    //       this.closeModal(); // Close the modal after successful update
    //     },
    //     error: (error) => {
    //       // Handle error
    //       console.error('Error updating profile', error);
    //       this.toastr.error(error.error.message);
    //     },
    //   });
    // } else if ((this, this.profileInfo.role === 'customer')) {
    //   // Perform the PATCH request to update the profile
    //   // this.customerService.updateProfile(this.editProfileForm.value).subscribe({
    //   //   next: (response) => {
    //   //     // Handle success
    //   //     console.log('Profile updated successfully', response);
    //   //     let token = this.tokenservice.getToken(environment.cu_accessKey) || '';
    //   //     if(response.data?.token){
    //   //        token = response.data?.token;
    //   //     }
    //   //     this.profileEmitter.emit(response.data?.customerDetail)
    //   //     this.store.dispatch(loginSuccess({user: response.data?.user, token }));
    //   //     this.toastr.success('Profile updated successfully');
    //   //     this.closeModal(); // Close the modal after successful update
    //   //   },
    //   //   error: (error) => {
    //   //     // Handle error
    //   //     console.error('Error updating profile', error);
    //   //     this.toastr.error(error.error.message);
    //   //   },
    //   // });
    // }
  }
}
