import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect
} from '@angular/core';
import { PermissionService } from '../../services/global/permission.service';

/**
 * Structural directive that shows/hides an element based on the user's permissions.
 *
 * Usage:
 *   <button *hasPermission="'User.Create'">Add User</button>
 *   <div *hasPermission="['User.View', 'User.Create']; mode: 'any'">...</div>
 *
 * mode:
 *   'all'  (default) — user must have ALL listed permissions
 *   'any'           — user must have at least ONE of the listed permissions
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);

  @Input('hasPermission') permission: string | string[] = [];
  @Input('hasPermissionMode') mode: 'all' | 'any' = 'all';

  private hasView = false;

  ngOnInit(): void {
    this.updateView();

    // Re-evaluate whenever permissions change (e.g. after token refresh)
    effect(() => {
      // Reading the signal registers this effect as a dependency
      this.permissionService.permissions();
      this.permissionService.isSuperAdmin();
      this.updateView();
    });
  }

  private updateView(): void {
    const permissions = Array.isArray(this.permission)
      ? this.permission
      : [this.permission];

    const granted =
      this.mode === 'any'
        ? this.permissionService.hasAnyPermission(permissions)
        : this.permissionService.hasAllPermissions(permissions);

    if (granted && !this.hasView) {
      this.vcr.createEmbeddedView(this.tpl);
      this.hasView = true;
    } else if (!granted && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }
}
