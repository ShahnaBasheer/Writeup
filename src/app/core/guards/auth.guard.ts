

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';


export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const jwtTokenService = inject(TokenService);

  const url = state.url;
  const token = jwtTokenService.isValidToken(environment.us_accessKey);

  console.log(url)
  // If token is valid
  if (token) {
    // Prevent access to login, signup, or register if already authenticated
    if (['/login', '/signup', '/register'].includes(url)) {
      return router.createUrlTree(['/dashboard']);
    }
    return true;
  }

  // If token is invalid or missing
  if (!token) {
    // Prevent access to protected routes if not authenticated
    if (!['/login', '/signup', '/register'].includes(url)) {
      // Special case for OTP verification page
      if (url === '/otp-verification') {
        const emailExist = jwtTokenService.getToken('verificationEmail');
        console.log(emailExist)
        if (!emailExist) {
          return router.createUrlTree(['/login']);
        }
        return true;
      }
      return router.createUrlTree(['/login']);
    }
  }

  return true; // Allow navigation for public routes like login, signup, or register
};
