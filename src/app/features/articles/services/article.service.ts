import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Article,
  ArticleFormData,
  ArticleResponse,
} from '../../../core/models/article.model';

@Injectable()
export class ArticleService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<{ data: { articles: Article[], user: string}, message: string }> {
    return this.http.get<{ data: { articles: Article[], user: string}, message: string }>(`${environment.userUrl}/dashboard`, {
      withCredentials: true,
    });
  }

  createArticle(data: ArticleFormData): Observable<ArticleResponse> {
    const formData = new FormData();
    formData.append('title', data?.title);
    formData.append('category', data?.category);
    formData.append('content', data?.content);
    formData.append('description', data?.description);

    const coverpic = data?.image;
    if (coverpic instanceof File) {
      formData.append('image', coverpic);
    }
    return this.http.post<ArticleResponse>(
      `${environment.userUrl}/article`,
      formData,
      {
        withCredentials: true,
      }
    );
  }

  getMyArticles(): Observable<{ data: { articles: Article[], user: string}, message: string }> {
    return this.http.get<{ data: { articles: Article[], user: string}, message: string }>(`${environment.userUrl}/myarticles`, {
      withCredentials: true,
    });
  }

  getArticleDetail(articleId: string): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${environment.userUrl}/details/${articleId}`, {
      withCredentials: true,
    });
  }

  editArticle(data: ArticleFormData): Observable<ArticleResponse> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('content', data.content);
    formData.append('description', data.description);
    formData.append('articleId', data?.articleId || '');

    const coverpic = data.image;
    if (coverpic instanceof File) {
      formData.append('image', coverpic);
    }
    return this.http.patch<ArticleResponse>(
      `${environment.userUrl}/article`,
      data,
      {
        withCredentials: true,
      }
    );
  }

  deleteArticle(articleId: string): Observable<ArticleResponse> {
    return this.http.delete<ArticleResponse>(
      `${environment.userUrl}/article/${articleId}`,
      {
        withCredentials: true,
      }
    );
  }
}
