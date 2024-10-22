import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { isFieldInvalidator } from '../../../core/validators/forms.validator';
import { Article, ArticleFormData } from '../../../core/models/article.model';
import { QuillModule } from 'ngx-quill';
import { ArticleService } from '../../../features/articles/services/article.service';
import { Router } from '@angular/router';
import { PageLoaderComponent } from '../page-loader/page-loader.component';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule,
    PageLoaderComponent,
  ],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.css',
})
export class EditArticleComponent {
  article!: Article;
  @Input({ required: true }) isOpen: boolean = false;
  @Input({ required: true }) articleId: string = '';
  @Output() close = new EventEmitter<void>();
  isLoading: boolean = false;

  @Output() profileEmitter = new EventEmitter<Article>();

  editArticleForm!: FormGroup;

  imageUrl: string | ArrayBuffer | null = null; // Store the uploaded image URL
  categories = [
    { label: 'Technology', value: 'Technology' },
    { label: 'Health', value: 'Health' },
    { label: 'Business', value: 'Business' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Lifestyle', value: 'Lifestyle' },
    { label: 'Education', value: 'Education' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Food', value: 'Food' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Science', value: 'Science' },
    { label: 'Politics', value: 'Politics' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Fashion', value: 'Fashion' },
  ];

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction
      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['clean'], // remove formatting button
      ['link'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private articleservice: ArticleService
  ) {
    this.editArticleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(100),
          Validators.maxLength(400),
        ],
      ],
      category: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(200)]],
      image: [null, [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.articleservice.getArticleDetail(this.articleId).subscribe({
      next: (res) => {
        this.article = res.data?.article as Article;
        this.imageUrl = this.article.image;
        this.editArticleForm.patchValue(this.article);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(
          err.error?.message ?? 'Something went wrong. Please try later'
        );
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    return isFieldInvalidator(this.editArticleForm, fieldName);
  }

  closeModal() {
    this.close.emit();
  }

  onCancel() {
    this.router.navigate(['/details', this.articleId], { replaceUrl: true });
  }

  onSave() {
    if (this.editArticleForm.invalid) {
      this.editArticleForm.markAsTouched();
      return;
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input?.files && input?.files?.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.editArticleForm.get('image')?.patchValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const controls = this.editArticleForm.controls;
    if (this.editArticleForm.valid) {
      const formValue: ArticleFormData = this.editArticleForm
        .value as ArticleFormData;

      formValue.articleId = this.articleId;
      this.articleservice.editArticle(formValue).subscribe({
        next: (res) => {
          this.toastr.success(res?.message);
          this.router.navigate(['/details', this.articleId], {
            replaceUrl: true,
          });
        },
        error: (err) => {
          this.toastr.error(
            err.error?.message ?? 'Something went wrong. Please try later!'
          );
        },
      });
    } else {
      this.editArticleForm.markAllAsTouched();
    }
  }
}
