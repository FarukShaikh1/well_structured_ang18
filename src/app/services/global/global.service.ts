import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, of, Subject } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { API_URL } from "../../../utils/api-url";
import { NavigationURLs } from "../../../utils/application-constants";
import { LocalStorageService } from "../local-storage/local-storage.service";
import { RoleService } from "../role/role.service";
import { CellComponent } from "tabulator-tables";
import { ModuleResponse } from "../../interfaces/module-response";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private roleService: RoleService,
    private router: Router

  ) { }

  private reloadComponentSubject = new Subject<void>();
  private reloadBannerOnSubject = new Subject<void>();

  //it will be used to refresh the grid list after closing the popup
  private reloadGridSubject = new Subject<string>();
  private applyFilterSubject = new Subject<string>();

  // Observable to notify components
  reloadGrid$ = this.reloadGridSubject.asObservable();
  refreshList$ = this.applyFilterSubject.asObservable();
  reloadBanner$ = this.reloadBannerOnSubject.asObservable();

  // Method to call when data changes in the child component
  triggerGridReload(moduleName: string) {
    this.reloadGridSubject.next(moduleName);
  }

  triggerApplyFilter(moduleName: string) {
    this.applyFilterSubject.next(moduleName);
  }

  getReloadObservable() {
    return this.reloadComponentSubject.asObservable();
  }

  reloadComponent() {
    this.reloadComponentSubject.next();
  }

  reloadBanner() {
    this.reloadBannerOnSubject.next();
  }

  roleBasedNavigation(router: Router) {
    this.navigate(NavigationURLs.HOME, router);
  }

  navigate(url: string, router: Router) {
    router.navigate([url]);
  }

  getRoleModuleMappingData(): Observable<boolean> {
    return this.roleService.getLoggedInUserPermissions().pipe(
      map((result) => {
        if (result) {
          this.localStorageService.setRoleModuleMapping(result);
          if (result.data.length > 0) {
            const user = this.localStorageService.getLoggedInUserData();
            user.role = result.role;
            localStorage.setItem("user", JSON.stringify(user));
            return true;
          }
        }
        return false;
      }),
      catchError((error: any) => {
        console.error("Error fetching role data", error?.message);
        return of(false);
      })
    );
  }

  getCurrentRoute(): string {
    const tree = this.router.parseUrl(this.router.url);
    return tree.root.children['primary']?.segments.map(it => it.path)?.join('/')?.toLowerCase() || '';
  }

  isAccessible(action: string): boolean {
    const permissions = this.localStorageService.getRoleModuleMapping();
    const lowerCaseAction = action.toLowerCase();
    const mapping = permissions.find(
      (m: any) => m.route?.toLowerCase() === '/' + this.getCurrentRoute()
    );
    if (!mapping) {
      return false;
    }
    return mapping[lowerCaseAction] === true;
  }

  AccessibleModuleList(): ModuleResponse[] {
    const permissions = this.localStorageService.getRoleModuleMapping();
    return permissions
    .filter((m: any) => m.view === true)
    .map((m: any) => ({
      moduleName: m.moduleName,
      route: m.route,
      isVisible: true, // Since view = true, mark as visible
      displayOrder: m.displayOrder ?? 0, // fallback to 0 if undefined
      iconClass: m.iconClass || ''       // fallback to empty string if undefined
    }));
        }

  isPermitted(roles: string[]) {
    const user = this.localStorageService.getLoggedInUserData();
    const loggedInUserRole = user?.role;
    if (roles.includes(loggedInUserRole)) {
      return true;
    }
    return false;
  }

  /**
   * Formats a message by replacing placeholders with given values.
   *
   * Example: formatMessage('Password must be {0}-{1} characters long.', 8, 15)
   * Output: Password must be 8-15 characters long.
   *
   * @param {string} message - the message to format
   * @param {...any[]} values - the values to replace placeholders in the message
   * @returns {string} the formatted message
   */
  formatMessage(message: string, ...values: any[]): string {
    return message.replace(/{(\d+)}/g, (match, index) => values[index] || "");
  }

  // Unique name validator for type ahead
  uniqueNameValidator(clientNames: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.value?.trim().toLowerCase();
      const isDuplicate = clientNames.some(
        (existingName) => existingName.toLowerCase() === name
      );
      return isDuplicate ? { nameExists: true } : null;
    };
  }

  getCommonListItems(commonListId: String) {
    const params = new HttpParams().set(
      "commonListId",
      commonListId.toString()
    );
    return this.http.get(API_URL.GET_COMMON_LIST_ITEMS, { params: params });
  }

  getCountryList() {
    return this.http.get(API_URL.GET_COUNTRY_LIST);
  }

  trimAllFields(form: any) {
    // Trim whitespace from all form control values
    Object.keys(form?.controls).forEach((key) => {
      const control = form?.get(key);
      if (key !== 'picture' && control && typeof control.value === "string") {
        control.setValue(control.value.trim());
      }
    });
  }

  validateAmount(event: any) {
    // if (event.target.value.match(/^[0-9]{0,20}$/)) {
    if (event.key.match(/^[\D]$/) && event.key.match(/^[^\.\-]$/)) {
      event.preventDefault();
    }
  }

  hidebuttonFormatter(cell: CellComponent) {
    return `<button class="action-buttons" title="Hide" style="padding-right:100px;"><i class="bi bi-dash-lg btn-link"></i></button>`;
  }

  getModuleList() {
    return this.http.get(API_URL.GET_COUNTRY_LIST);
  }

}
