import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { GlobalErrorHandlerService } from "../services/error-handling/global-error-handler.service";
import { GlobalService } from "../services/global/global.service";
import { LocalStorageService } from "../services/local-storage/local-storage.service";

export const publicGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  
  if (
    state.url.includes("/login/callback") ||
    localStorage.getItem("initiatedLogout")
  ) {
    localStorage.removeItem("initiatedLogout");
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
    
    const globalErrorHandler = inject(GlobalErrorHandlerService);
    globalErrorHandler.handleError(error);

    
    
    

    
    return false;
  }
};
