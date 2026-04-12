import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        // Might only want to redirect if it's a 'GET' for a main resource
        router.navigate(['/error-404']);
      } else if (error.status === 500) {
        // Handle server explosion
        console.error('Server side error', error);
      }
      return throwError(() => error);
    })
  );
};
