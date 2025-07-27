import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { GlobalService } from "../services/global/global.service";
import { NavigationURLs } from "../../utils/application-constants";
import { lastValueFrom } from "rxjs";
import { LocalStorageService } from "../services/local-storage/local-storage.service";

export const authGuard: CanActivateFn = async (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const localStorageService = inject(LocalStorageService);
  const globalService = inject(GlobalService);
  const router = inject(Router);

  if (state.url.includes("/login/callback")) {
    return true;
  }

  try {
    if (localStorageService.isAuthenticated()) {
      let isAuthorized = localStorageService.isUserAuthorized();
      if (isAuthorized) {
        return true;
      } else {
        isAuthorized = await lastValueFrom(globalService.getRoleModuleMappingData());
        isAuthorized = true;
        if (isAuthorized) {
          return true;
        } else {
          router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
          return false;
        }
      }
    } else {
      router.navigate([NavigationURLs.LOGIN]);
      return false;
    }
  } catch (error) {
    console.error("Error in authGuard:", error);
    router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
    return false;
  }
};
