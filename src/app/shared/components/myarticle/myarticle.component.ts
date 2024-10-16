import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../../core/models/article.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TruncatePipe } from '../../../core/pipe/truncate.pipe';



@Component({
  selector: 'app-myarticle',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  templateUrl: './myarticle.component.html',
  styleUrl: './myarticle.component.css',
})
export class MyarticleComponent {
  @Input({ required: true }) article!: Article;
  @Output() articleDeleted = new EventEmitter<boolean>(); // Create EventEmitter


  constructor(private router: Router) {}
  onSelectArticle() {
    this.router.navigate(['/details', this.article?._id]);
  }

  onEdit(){
    this.router.navigate(['/update/article', this.article?._id], { replaceUrl: true })
  }

  onDelete(){
      this.articleDeleted.emit(true);
  }

}
