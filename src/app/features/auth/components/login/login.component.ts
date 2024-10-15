import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isFieldInvalidator } from '../../../../core/validators/forms.validator';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { SideBannerComponent } from '../../../../shared/components/side-banner/side-banner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule,
    ReactiveFormsModule, LoaderComponent,
    SideBannerComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm !: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      "email": ['', [Validators.required, Validators.email]],
      "password": ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    return isFieldInvalidator(this.loginForm, fieldName);
  }

  onSubmit(){
    if(this.loginForm.valid){

    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
