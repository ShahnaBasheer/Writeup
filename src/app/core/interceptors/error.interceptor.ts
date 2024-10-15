import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';


export const ErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const router = inject(Router);
    const toastr = inject(ToastrService);
    const tokenService = inject(TokenService);
    const path = (new URL(req.url)).pathname;


    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred!';

            if (error.error instanceof ErrorEvent) {
                // Client-side errors
                console.log('client side error', error.error.message);

            } else {
                // Server-side errors, error.error.message
                console.log('server side error');
                if(path.startsWith('/admin/')){
                    if(error.status === 401){
                      if(req.headers.has('Authorization')){
                        console.log("401 admin authorization");

                      }
                    }
                }  else if(path.startsWith('/api/')){
                    if(error.status === 401){
                      console.log("401 error ");
                      tokenService.removeToken(environment.us_accessKey);
                      router.navigate(['/login'], { replaceUrl: true })
                    } else if(error.status === 403){
                      toastr.error("User account is Blocked!", 'error');
                    }
                }


            }
            // throwError(() => new Error(errorMessage))

            return throwError(() => error);
        })
    );
};
