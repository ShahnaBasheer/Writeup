import { Component } from '@angular/core';
import { SideBannerComponent } from '../../../../shared/components/side-banner/side-banner.component';
import { RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isFieldInvalidator } from '../../../../core/validators/forms.validator';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';


@Component({
  selector: 'app-interested-topics',
  standalone: true,
  imports: [ SideBannerComponent, RouterModule,
      ReactiveFormsModule, CommonModule,
      LoaderComponent
   ],
  templateUrl: './interested-topics.component.html',
  styleUrl: './interested-topics.component.css'
})

export class InterestedTopicsComponent {
  isLoading: boolean = false;
  topicsForm!: FormGroup;
  isEnabled = true;
  interestsList: string[] = [
    "Technology" , "Health" ,"Business" , "Sports",
    "Lifestyle", "Education", "Travel", "Food" ,
    "Entertainment", "Science", "Politics",
    "Finance" , "Fashion"
  ];

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.topicsForm = this.fb.group({
      interests: this.fb.array([], Validators.required)
    });

    this.interestsList.forEach((value) => {
      const control = this.fb.control({name: value, selected: false});
      (this.topicsForm.get('interests') as FormArray).push(control);
    });
  }


  get interestsControls(): {name: string, selected: boolean}[] {
    return (this.topicsForm.get('interests') as FormArray).value;
  }


  onSubmit(){
    if(this.topicsForm.valid){

    } else {
      this.topicsForm.markAllAsTouched();
    }
  }


  isFieldInvalid(fieldName: string): boolean {
    return isFieldInvalidator(this.topicsForm, fieldName);
  }


  isInterestInvalid(): boolean {
    const interestsArray = this.topicsForm.get('interests') as FormArray;
    return interestsArray.length === 0 && (this.topicsForm.dirty || this.topicsForm.touched);
  }

  onCheckboxChange(event: Event, index: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    let arr = this.topicsForm.get('interests') as FormArray;
    const control = arr?.at(index) as FormGroup;
    control.patchValue({  name: control.value.name, selected: isChecked });
  }
}
