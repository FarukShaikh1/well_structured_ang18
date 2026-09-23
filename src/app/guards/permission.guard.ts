import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import { PermissionService } from '../services/permission/permission.service';

export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const moduleName = route.data['module'];
  const permission = route.data['permission'] ?? 'view';

  if (!moduleName) {
    console.error('PermissionGuard: Module name is missing.');
    return router.createUrlTree(['/home']);
  }

  const hasPermission =
    permissionService.hasPermission(moduleName, permission);

  if (hasPermission) {
    return true;
  }

  console.warn(
    `Access denied: ${moduleName} - ${permission}`
  );

  return router.createUrlTree(['/home/access-denied']);
};