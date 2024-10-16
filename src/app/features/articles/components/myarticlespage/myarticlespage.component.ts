import { Component } from '@angular/core';
import { MyarticleComponent } from '../../../../shared/components/myarticle/myarticle.component';
import { Article } from '../../../../core/models/article.model';
import { ArticleService } from '../../services/article.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DeleteAlertComponent } from '../../../../shared/components/delete-alert/delete-alert.component';


@Component({
  selector: 'app-myarticlespage',
  standalone: true,
  imports: [ MyarticleComponent, CommonModule, DeleteAlertComponent],
  templateUrl: './myarticlespage.component.html',
  styleUrl: './myarticlespage.component.css',
})
export class MyarticlespageComponent {
  articles: Article[] = [];
  showDeleteModal: boolean = false;
  deleteIndex: number = -1;


  constructor(
    private articleservice: ArticleService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.articleservice.getMyArticles().subscribe({
      next: (res) => {
        this.articles = res?.data?.articles;
      },
      error: (err) => {
        this.toastr.error(
          err.error?.message ?? 'Something went wrong! Try again Later'
        );
      },
    });
  }

  onDeleteConfirm(isDeleted: boolean) {
    if (isDeleted) {
      const article = this.articles[this.deleteIndex];
      console.log('Article was successfully deleted.', article?._id);
      this.deleteArticle(article?._id || '');
    } else {
      console.log('Cancel to delete the article.');
    }
    this.showDeleteModal = false;
  }

  onDeleteAlert(data: boolean, index: number){
    this.showDeleteModal = true;
    this.deleteIndex = index;
  }

  deleteArticle(articleId: string) {
    if(articleId){
      this.articleservice.deleteArticle(articleId).subscribe({
        next: (res) => {
          this.articles.splice(this.deleteIndex, 1);
          this.toastr.success("Successfully Deleted the Article");
        },
        error: (err) => {
          this.toastr.error( err.error?.message ?? 'Something went wrong. Please try later');
        }
      })
    }

  }
}
