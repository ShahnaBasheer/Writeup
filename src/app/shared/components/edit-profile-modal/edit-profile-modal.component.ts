import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isFieldInvalidator } from '../../../core/validators/forms.validator';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.css',
})
export class EditProfileModalComponent {
  @Input() isOpen: boolean = false;
  @Input() profileInfo!: User;
  @Output() close = new EventEmitter<void>();
  showOtpModal: boolean = false;
  halfLength = 0;
  interestsList: string[] = [
    'Technology',
    'Health',
    'Business',
    'Sports',
    'Lifestyle',
    'Education',
    'Travel',
    'Food',
    'Entertainment',
    'Science',
    'Politics',
    'Finance',
    'Fashion',
  ];

  @Output() profileEmitter = new EventEmitter<User>();

  editProfileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService,
    private router: Router
  ) {
    this.editProfileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      work: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      interests: this.fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.halfLength = Math.ceil(this.interestsList.length / 2)
    this.interestsList.forEach((value, index) => {
      // Create form control with initial selected state
      const isSelected = this.profileInfo?.interests?.includes(value) || false;
      const control = this.fb.control({ name: value, selected: isSelected });
      // Push form control to the FormArray
      (this.editProfileForm.get('interests') as FormArray).push(control);
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

  get interestsControls(): { name: string; selected: boolean }[] {
    return (this.editProfileForm.get('interests') as FormArray).value;
  }

  isInterestInvalid(): boolean {
    const interestsArray = this.editProfileForm.get('interests') as FormArray;
    return (
      interestsArray.length === 0 &&
      (this.editProfileForm.dirty || this.editProfileForm.touched)
    );
  }

  closeModal() {
    this.close.emit();
  }

  onSave() {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAsTouched();
      return;
    }

    // Extract and filter selected interests
    const selectedInterests: string[] = this.editProfileForm
      .get('interests')
      ?.value.filter(
        (interest: { name: string; selected: boolean }) => interest.selected
      )
      .map((interest: { name: string; selected: boolean }) => interest.name);

    // Cast the form value as a Partial<User> since not all fields might be sent
    const formValue: Partial<User> = this.editProfileForm
      .value as Partial<User>;

    formValue.interests = selectedInterests;

    // Call the service to edit the profile
    this.authservice.editProfile(formValue).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.profileEmitter.emit(res.data.profile)
        this.router.navigate(['/profile'], { replaceUrl: true });
        this.isOpen = false;
      },
      error: (err) => {
        // Display error message
        this.toastr.error(
          err.error?.message ?? 'Something went wrong. Please try again later.'
        );
        // Log error for debugging
        console.error('Profile Edit Error: ', err);
      },
    });
  }

  onCheckboxChange(event: Event, index: number) {
    const isChecked = (event.target as HTMLInputElement)?.checked;
    let arr = this.editProfileForm.get('interests') as FormArray;
    const control = arr?.at(index) as FormGroup;
    control.patchValue({ name: control.value.name, selected: isChecked });
  }
}
