import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable()

export class ArticleService {


  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${environment.userUrl}/dashboard`, {
      withCredentials: true
    });
  }
}
