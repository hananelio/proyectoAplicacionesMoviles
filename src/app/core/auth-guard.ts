import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthRestService } from '../services/core/auth-rest.service';
import { catchError, map, from } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthRestService);
  const router = inject(Router);

  return from(authService.getToken()).pipe(
    map(token =>{
      return true;
    }),
    catchError(err =>{
      router.navigate(['/home'], {queryParams: { returnUrl: state.url}});
      return from([false]);
    })
  )
};

