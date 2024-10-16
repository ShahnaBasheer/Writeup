import { Component, Input } from '@angular/core';
import { Article } from '../../../core/models/article.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-card',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './detail-card.component.html',
  styleUrl: './detail-card.component.css',
})
export class DetailCardComponent {
  @Input({ required: true }) article!: Article;

  constructor(private router: Router) {}

  onSelectDetail() {
    this.router.navigate(['/details', this.article?._id]);
  }


}
