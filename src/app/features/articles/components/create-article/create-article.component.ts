import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { isFieldInvalidator } from '../../../../core/validators/forms.validator';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [ ReactiveFormsModule, QuillModule, CommonModule ],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.css'
})
export class CreateArticleComponent {
  articleForm!: FormGroup;
  imageUrl: string | ArrayBuffer | null = null; // Store the uploaded image URL
  categories = [
    { label: "Technology", value: "Technology" },
    { label: "Health", value: "Health" },
    { label: "Business", value: "Business" },
    { label: "Sports", value: "Sports" },
    { label: "Lifestyle", value: "Lifestyle" },
    { label: "Education", value: "Education" },
    { label: "Travel", value: "Travel" },
    { label: "Food", value: "Food" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Science", value: "Science" },
    { label: "Politics", value: "Politics" },
    { label: "Finance", value: "Finance" },
    { label: "Fashion", value: "Fashion" },
  ]


  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link'] ,
    ],
  }

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
     this.articleForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        category: ['', [Validators.required, Validators.minLength(3)]],
        content: ['', [Validators.required, Validators.minLength(100)]],
        image:  [null, [Validators.required]],
     })
  }

    // Handle file input change
    onFileChange(event: Event) {
      const input = event.target as HTMLInputElement;

      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
          this.imageUrl = reader.result; // Set the image URL
        };

        reader.readAsDataURL(file); // Read the file as a data URL
      }
    }

    isFieldInvalid(fieldName: string): boolean {
      return isFieldInvalidator(this.articleForm, fieldName);
    }

    onReset(){
      this.articleForm.reset()
    }

    onSubmit(){
        console.log("hjbchjdhj")
        if(this.articleForm.valid){

        } else {
          this.articleForm.markAllAsTouched();
        }
    }
}
