

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';



export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>  {
    const router =  inject(Router);
    const jwtTokenService = inject(TokenService)

    const url = state.url;
    const token = jwtTokenService.isValidToken(environment.us_accessKey);

    if(token){
        if(url === '/login' || url === '/signup'){
          return router.createUrlTree(['/dashboard']);
        }
    }
    return true;
}
