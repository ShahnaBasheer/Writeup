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
    const storedEmail =
      this.tokenservice.getToken(environment.us_accessKey) ?? '';
    if (storedEmail) this.emailSubject.next(storedEmail);

    const userstring = this.tokenservice.getToken('userInfo') ?? '';
    if (userstring) {
      const user: User = JSON.parse(userstring);
      this.userSubject.next(user);
    }
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.userUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res: AuthResponse) => {
          if (res.data?.token && res.data?.user) {
            this.tokenservice.setToken(
              environment.us_accessKey,
              res.data?.token
            );
            this.tokenservice.setProperty(
              'userInfo',
              JSON.stringify(res.data?.user)
            );
            this.userSubject.next(res.data?.user);
          }
        })
      );
  }

  register(userData: {
    fullName: string;
    email: string;
    work: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.userUrl}/signup`, userData, {
        withCredentials: true,
      })
      .pipe(
        tap((res: AuthResponse) => {
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

  setUser(user: User) {
    this.userSubject.next(user);
  }

  logout(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.userUrl}/logout`,{} ,{
        withCredentials: true,
      })
      .pipe(
        tap((res: AuthResponse) => {
          this.tokenservice.removeToken(environment.us_accessKey);
          this.userSubject.next(null);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!this.tokenservice.getToken(environment.us_accessKey);
  }

  verifyOTP(email: string, otp: string): Observable<AuthResponse> {
    const payload = { email, otp };
    return this.http
      .post<AuthResponse>(`${environment.userUrl}/verify-otp`, payload, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.tokenservice.removeToken('verificationEmail');
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  resendOTP(email: string): Observable<{ data: { email: string, remainingLimit: number }, message: string }> {
    return this.http.post<{ data: { email: string, remainingLimit: number }, message: string }>(
      `${environment.userUrl}/resend-otp`,
      { email },
      {
        withCredentials: true,
      }
    );
  }

  getProfilePage(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${environment.userUrl}/profile`, {
      withCredentials: true,
    });
  }

  editProfile(data: Partial<User>): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${environment.userUrl}/profile`, data, {
      withCredentials: true,
    });
  }

  passwordChange(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<{ data: { user: User }, message: string }> {
    return this.http.patch<{ data: { user: User }, message: string }>(
      `${environment.userUrl}/profile/change-password`,
      data,
      {
        withCredentials: true,
      }
    );
  }

  sendOtpForEmail(email: string): Observable<{ data: { profile: User, user: User, email: string }, message: string }> {
    return this.http.patch<{ data: { profile: User, user: User, email: string }, message: string }>(
      `${environment.userUrl}/profile/change-email`,
      { email },
      {
        withCredentials: true,
      }
    );
  }

  verifyOTPForEmail(data: { oldOtp: string, newOTP: string }): Observable<{ data: { profile: User, user: User }, message: string }>{
    return this.http.patch<{ data: { profile: User, user: User }, message: string }>(
      `${environment.userUrl}/profile/verify-otp`,
      data,
      {
        withCredentials: true,
      }
    );
  }
}
