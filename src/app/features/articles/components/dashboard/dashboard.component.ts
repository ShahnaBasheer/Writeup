import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  articles: any[] = [];
  constructor(
    private router: Router,
    private articleservice: ArticleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.articleservice.getDashboard().subscribe({
      next: (res) => {
        this.articles = [];
      },
      error: (err) => {
        this.toastr.error(
          err.error?.message ?? 'Something went wrong.Please Try Later'
        );
      },
    });
  }

  onSelectDetail() {
    this.router.navigate(['/details']);
  }
}
