import { Injectable, signal, computed } from '@angular/core';

/**
 * Stores the current user's permissions (loaded once after login).
 * SuperAdmins receive ["*"] which grants access to everything.
 * Used by PermissionAuthorizationHandler (backend) and *hasPermission directive (frontend).
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly _permissions = signal<string[]>([]);
  private readonly _isSuperAdmin = signal<boolean>(false);

  /** All permission strings for the current session. */
  readonly permissions = this._permissions.asReadonly();

  /** True if the user has the wildcard '*' permission (SuperAdmin). */
  readonly isSuperAdmin = computed(() => this._isSuperAdmin());

  /**
   * Called once after a successful login / token refresh.
   * @param permissions Array of permission strings, e.g. ['User.View', 'User.Create'].
   *                    SuperAdmins receive ['*'].
   * @param isSuperAdmin Flag from the auth response.
   */
  setPermissions(permissions: string[], isSuperAdmin: boolean): void {
    this._isSuperAdmin.set(isSuperAdmin);
    this._permissions.set(permissions);
  }

  /**
   * Returns true if the user has the given permission.
   * SuperAdmins bypass all permission checks.
   */
  hasPermission(permission: string): boolean {
    if (this._isSuperAdmin()) return true;
    const perms = this._permissions();
    return perms.includes('*') || perms.includes(permission);
  }

  /**
   * Returns true if the user has ALL of the given permissions.
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }

  /**
   * Returns true if the user has ANY of the given permissions.
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  /** Clears permissions on logout. */
  clear(): void {
    this._permissions.set([]);
    this._isSuperAdmin.set(false);
  }
}
