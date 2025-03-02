import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NavigationURLs } from '../../../utils/application-constants';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { RoleService } from '../role/role.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { API_URL } from '../../../utils/api-url';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private roleService: RoleService
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
    return this.roleService.getModulesMappedToLoggedinUser().pipe(
      map((result: { data: any }) => {
        if (result?.data) {
          this.localStorageService.setRoleModuleMapping(result.data);
          if (result.data.length > 0) {
            const user = this.localStorageService.getLoggedInUserData();
            user.role = result.data[0].role;
            localStorage.setItem('user', JSON.stringify(user));
            return true;
          }
        }
        return false;
      }),
      catchError((error: any) => {
        console.error('Error fetching role data', error?.message);
        return of(false);
      })
    );
  }

  isAccessible(module: string, action: string): boolean {
    const rolePageMapping = this.localStorageService.getRoleModuleMapping();
    const lowerCaseAction = action.toLowerCase();

    const mapping = rolePageMapping.find(
      (m: any) => m.moduleName.toLowerCase() === module.toLowerCase()
    );

    if (!mapping) {
      return false;
    }

    return mapping[lowerCaseAction] === true;
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
    return message.replace(/{(\d+)}/g, (match, index) => values[index] || '');
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
    const params = new HttpParams()
      .set('commonListId', commonListId.toString())
    return this.http.get(API_URL.GET_COMMON_LIST_ITEMS, { params: params });
  }
}
