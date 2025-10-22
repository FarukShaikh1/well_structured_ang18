import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ApplicationRoles, NavigationURLs } from '../../utils/application-constants';
import { GlobalService } from '../services/global/global.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';

export const routeAccessGuard: CanActivateFn = async (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);
  const globalService = inject(GlobalService);

  try {
    if (localStorageService.isAuthenticated() && localStorageService.isUserAuthorized()) {
      if (state.url.endsWith('home/projects/project')) {
        if (globalService.isPermitted([ApplicationRoles.Platform_Admin, ApplicationRoles.Project_Manager, ApplicationRoles.Finance_User, ApplicationRoles.Sample_Management_User])) {
          return true;
        } else {
          router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
          return false;
        }
      } if (state.url.endsWith('home/clients/client')) {
        if (globalService.isPermitted([ApplicationRoles.Platform_Admin, ApplicationRoles.Project_Manager, ApplicationRoles.Finance_User, ApplicationRoles.Sample_Management_User])) {
          return true;
        } else {
          router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
          return false;
        }
      } else {
        return true;
      }
    } else {
      router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
      return false;
    }
  } catch (error) {
    console.error(error);
    router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
    return false;
  }
};
