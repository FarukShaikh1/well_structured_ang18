import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { GlobalErrorHandlerService } from '../services/error-handling/global-error-handler.service';
import { GlobalService } from '../services/global/global.service';
import { NavigationURLs, ApplicationModuleActions} from '../../utils/application-constants';

export const moduleAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  if (state.url.includes('/login/callback')) {
    return true;
  }

  try {
    const globalService = inject(GlobalService);
    const router = inject(Router);

    const moduleName = route.data['moduleName']; // Get the module name from the route data

    if (globalService.isAccessible(moduleName, ApplicationModuleActions.VIEW)) {
      return true;
    } else {
      router.navigate([NavigationURLs.ERROR_PAGE]);
      return false;
    }
  } catch (error) {
    // Handle the error using the global error handler service or custom logic
    const globalErrorHandler = inject(GlobalErrorHandlerService);
    globalErrorHandler.handleError(error);

    // Optionally, you can redirect the user to a specific error page
    // const router = inject(Router);
    // router.navigate([Url_To_Navigate.ERROR_PAGE]);

    // Return false to prevent navigation in case of an error
    return false;
  }
};
