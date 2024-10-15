import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { AuthResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private emailSubject = new BehaviorSubject<string>('');
  email$ = this.emailSubject.asObservable();
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private tokenservice: TokenService) {
      const storedEmail = this.tokenservice.getToken(environment.us_accessKey) ?? '';
      if (storedEmail) this.emailSubject.next(storedEmail);

      const userstring = this.tokenservice.getToken("userInfo") ?? '';
      if(userstring){
        const user: User = JSON.parse(userstring);
        this.userSubject.next(user);
      }
  }

  login(credentials: { email: string, password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.userUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res: AuthResponse) => {
          if(res.data?.token && res.data?.user){
            this.tokenservice.setToken(environment.us_accessKey, res.data?.token);
            this.tokenservice.setProperty('userInfo', JSON.stringify(res.data?.user));
            console.log(res, "jkkkkkkkkk")
            this.userSubject.next(res.data?.user);
          }
        })
      );
  }

  register(userData: { fullName: string, email: string, work: string, password: string }): Observable<any> {
    return this.http
      .post<any>(`${environment.userUrl}/signup`, userData, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          const email = res?.data?.email;
          if (email) {
            this.tokenservice.setToken('verificationEmail', email);
            this.setEmail(email);
          }
        })
      );
  }

  setEmail(email: string) {
    this.emailSubject.next(email);
  }

  logout(): Observable<any> {
    return this.http
      .get<any>(`${environment.userUrl}/logout`, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          this.tokenservice.removeToken(environment.us_accessKey);
          this.userSubject.next(null);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!this.tokenservice.getToken(environment.us_accessKey);
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    const payload = { email, otp };
    return this.http.post<any>(`${environment.userUrl}/verify-otp`, payload,
      { withCredentials: true }).pipe(
        tap((res: any) => {
          this.tokenservice.removeToken('verificationEmail')
        }),
        catchError((error) => {
          throw error;
        })
    );
  }

  resendOTP(email: string): Observable<any> {
    return this.http.post<any>(`${environment.userUrl}/resend-otp`, { email }, {
      withCredentials: true
    });
  }
}
