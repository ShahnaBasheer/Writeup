import { Component } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { ToastrService } from 'ngx-toastr';
import { DetailCardComponent } from '../../../../shared/components/detail-card/detail-card.component';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from '../../../../shared/components/page-loader/page-loader.component';
import { Article } from '../../../../core/models/article.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ DetailCardComponent, CommonModule, PageLoaderComponent ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  articles: Article[] = [];
  isLoading: boolean = false;
  constructor(
    private articleservice: ArticleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.articleservice.getDashboard().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.articles = res.data?.articles || [];

      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(
          err.error?.message ?? 'Something went wrong.Please Try Later'
        );
      },
    });
  }


}
