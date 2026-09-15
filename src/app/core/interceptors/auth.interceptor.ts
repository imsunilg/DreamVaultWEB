import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const PUBLIC_PATHS = ['/auth/login', '/auth/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const isPublicEndpoint = PUBLIC_PATHS.some(path => req.url.includes(path));
  const token = authService.token;
  const authorizedReq = token && !isPublicEndpoint ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublicEndpoint) {
        authService.logout();
        router.navigate(['/login']);
      }

      if (error.status === 403) {
        snackBar.open('Access denied. You do not have permission to do that.', 'Dismiss', { duration: 4000 });
      }

      return throwError(() => error);
    })
  );
};
