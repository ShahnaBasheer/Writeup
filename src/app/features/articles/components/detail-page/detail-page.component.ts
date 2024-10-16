import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ToastrService } from 'ngx-toastr';
import { Article } from '../../../../core/models/article.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { EditArticleComponent } from '../../../../shared/components/edit-article/edit-article.component';
import { DeleteAlertComponent } from '../../../../shared/components/delete-alert/delete-alert.component';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [ CommonModule, EditArticleComponent, DeleteAlertComponent ],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.css'
})
export class DetailPageComponent {
  @Input() articleId!: string;
  isEditable: boolean = false;
  userId: string = '';
  article!: Article;
  showDeleteModal: boolean = false;


  constructor(
    private router: Router,
    private articleservice: ArticleService,
    private toastr: ToastrService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {

    const author = this.authservice.user$.subscribe(user => {
      this.userId = user?._id || '';
    })

    if (this.articleId) {
      this.loadArticleDetails(this.articleId);
    }



  }
  loadArticleDetails(articleId: string) {
    this.articleservice.getArticleDetail(articleId).subscribe({
      next: (res) => {
       this.article = res.data?.article;
       console.log(this.userId, this.article.author._id)
       if(this.userId === this.article.author._id){
        this.isEditable = true;
       }
      },
      error: (err) => {
        this.toastr.error(
          err.error?.message ?? 'Something went wrong. Please try later'
        );
      }
    });
  }

  toggleEditArticle() {
    this.router.navigate(['/update/article', this.article._id], { replaceUrl: true })
  }

  // Handle save profile details
  onSaveArticle(updatedProfile: any) {
    console.log('Updated Profile:', updatedProfile);
    this.toggleEditArticle();
  }

  onEditedArticle(data: any){
    this.article = data;
  }

  onDelete(){
    this.showDeleteModal = true;
  }

  onDeleteConfirm(isDeleted: boolean) {
    if (isDeleted) {
      this.deleteArticle(this.article?._id || '');
    } else {
      console.log('Cancel to delete the article.');
    }
    this.showDeleteModal = false;
  }


  deleteArticle(articleId: string) {
    if(articleId){
      this.articleservice.deleteArticle(articleId).subscribe({
        next: (res) => {
          this.toastr.success("Successfully Deleted the Article");
        },
        error: (err) => {
          this.toastr.error( err.error?.message ?? 'Something went wrong. Please try later');
        }
      })
    }

  }


}
