import { Component } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { ToastrService } from 'ngx-toastr';
import { DetailCardComponent } from '../../../../shared/components/detail-card/detail-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ DetailCardComponent, CommonModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  articles: any[] = [];
  constructor(
    private articleservice: ArticleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.articleservice.getDashboard().subscribe({
      next: (res) => {
        this.articles = res.data?.articles || [];
        console.log(this.articles)
      },
      error: (err) => {
        this.toastr.error(
          err.error?.message ?? 'Something went wrong.Please Try Later'
        );
      },
    });
  }


}
