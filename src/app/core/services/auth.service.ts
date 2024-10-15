import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<User> {
    return this.http.post<User>('/api/auth/login', credentials).pipe(
      tap((user) => {
        // localStorage.setItem('token', user.token);
        // this.userSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
