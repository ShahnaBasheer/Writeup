import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Article } from '../../../core/models/article.model';


@Injectable()

export class ArticleService {


  constructor(private http: HttpClient) {}



  getDashboard(): Observable<any> {
    return this.http.get<any>(`${environment.userUrl}/dashboard`, {
      withCredentials: true
    });
  }

  createArticle(data: any): Observable<any>{
    return this.http.post<any>(`${environment.userUrl}/create/article`, data , {
      withCredentials: true
    },
  );
  }

  getMyArticles(): Observable<any>{
    return this.http.get<any>(`${environment.userUrl}/myarticles`, {
      withCredentials: true
    });
  }

  getArticleDetail(articleId: string): Observable<any> {
    return this.http.get<any>(`${environment.userUrl}/details/${articleId}`, {
      withCredentials: true
    });
  }

  editArticle(data: any): Observable<any>{
    return this.http.patch<any>(`${environment.userUrl}/update/article`, data , {
      withCredentials: true
    });
  }

  deleteArticle(articleId: string): Observable<any> {
    return this.http.delete<any>(`${environment.userUrl}/delete/article/${articleId}`, {
      withCredentials: true
    });
  }

}
