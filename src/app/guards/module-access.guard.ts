import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { GlobalErrorHandlerService } from '../services/error-handling/global-error-handler.service';
import { GlobalService } from '../services/global/global.service';
import { NavigationURLs, ActionConstant} from '../../utils/application-constants';

export const moduleAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  if (state.url.includes('/login/callback')) {
    return true;
  }

  try {
    const globalService = inject(GlobalService);
    const router = inject(Router);

    const moduleName = route.data['moduleName']; 

    if (globalService.isAccessible(ActionConstant.VIEW)) {
      return true;
    } else {
      router.navigate([NavigationURLs.ERROR_PAGE]);
      return false;
    }
  } catch (error) {
    
    const globalErrorHandler = inject(GlobalErrorHandlerService);
    globalErrorHandler.handleError(error);

    
    
    

    
    return false;
  }
};
