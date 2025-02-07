import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { GlobalErrorHandlerService } from '../services/error-handling/global-error-handler.service';
import { GlobalService } from '../services/global/global.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';

export const publicGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  // Skip guard if the route is 'login/callback'
  if (state.url.includes('/login/callback') || localStorage.getItem('initiatedLogout')) {
    localStorage.removeItem('initiatedLogout');
    return true;
  }

  try {
    const localStorageservice = inject(LocalStorageService);
    const golbalService = inject(GlobalService);
    const router = inject(Router);

    if (localStorageservice.isAuthenticated()) {
      golbalService.roleBasedNavigation(router);
      return false;
    }

    return true;
  } catch (error) {
    // Handle the error using the global error handler service or custom logic
    const globalErrorHandler = inject(GlobalErrorHandlerService);
    globalErrorHandler.handleError(error);

    // Optionally, you can redirect the user to a specific error page
    // const router = inject(Router);
    // router.navigate(['/error-page']); // Replace '/error-page' with your actual error route

    // Return false to prevent navigation in case of an error
    return false;
  }
};