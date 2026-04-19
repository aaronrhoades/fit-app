import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// route and segments should be used or removed in the future when we have more complex routing and need to determine access based on route parameters or segments
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanMatchFn = (route, segments) => { //TODO: use route and segments to determine if the user has access to the route
const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login and return false to stop the route from matching
  return router.parseUrl('/login');
};
