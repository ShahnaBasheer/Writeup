import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const authservice = inject(AuthService);

  let tokenKey!: string ;
  const postRequests = new Set([
    '/api/login',
    '/api/signup',
    '/api/verify-otp',
    '/api/resend-otp',
  ]);
  const path = new URL(req.url).pathname;
  const isPostRequest = postRequests.has(path);

  if (req.method === 'POST' && isPostRequest) return next(req);

  if (path.startsWith('/api')) {
    tokenKey = environment.us_accessKey;
  }

  let token!: string;

  try {
    if(!tokenKey) throw new Error("Token key is not found");
    token = tokenService.getToken(tokenKey) || '';
  } catch (error: any) {
    console.error('Error parsing token from localStorage', error?.message);
  }

  if (token && !isPostRequest) {
    console.log(path, 'with token');
    const modified = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(modified).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const data = event.body?.data;
          if (data && !path.includes('/logout')) {
            let newToken: string = data.token;

            if (newToken) {
              tokenService.setToken(tokenKey, newToken);
            } else {
              newToken = token;
            }

            tokenService.setProperty('userInfo', JSON.stringify(data?.user))
            authservice.setUser(data?.user)
          }
        }
      })
    );
  }
  console.log(path, 'without token', req.method);

  return next(req);
};
