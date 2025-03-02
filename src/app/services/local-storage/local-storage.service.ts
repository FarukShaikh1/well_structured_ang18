import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServiceResponse } from '../../interfaces/service-response';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private currentUserSource = new BehaviorSubject<ServiceResponse | null>(null);

  constructor() { }

  clear(): void {
    localStorage.clear();
  }

  setCurrentUser(user: any, isUserLoggedIn: boolean, isSsoLogin: boolean) {
    // localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isUserLoggedIn', JSON.stringify(isUserLoggedIn));
    localStorage.setItem('isSsoLogin', JSON.stringify(isSsoLogin));
    this.currentUserSource.next(user);
  }

  getLoggedInUserData(): any {
    return localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;
  }

  isAuthenticated(): boolean {
    const user = this.getLoggedInUserData();
    if (!user) {
      return false;
    }
    const loginToken = user?.token;
    const userName = user?.userName;
    const isUserLoggedIn = localStorage.getItem('currentUser');

    return !!(
      // loginToken &&
      isUserLoggedIn === 'true' && // Ensure the value is exactly 'true'
      userName
    );
  }

  isSsoLogin(): boolean {
    return JSON.parse(localStorage.getItem('isSsoLogin') || 'false');
  }

  setRoleModuleMapping(data: any[]) {
    localStorage.setItem('roleModuleMapping', JSON.stringify(data));
  }

  getRoleModuleMapping(): any[] {
    return JSON.parse(localStorage.getItem('roleModuleMapping') || '[]');
  }

  getLoggedInUserRoleId(): string {
    return localStorage.getItem('loggedInUserRoleId') || '';
  }

  setLoggedInUserRoleId(loggedInUserRoleId: string) {
    localStorage.setItem('loggedInUserRoleId', loggedInUserRoleId);
  }

  isUserAuthorized(): boolean {
    const roleModuleMapping = this.getRoleModuleMapping();
    if (roleModuleMapping && Array.isArray(roleModuleMapping) && roleModuleMapping.length > 0) {
      return true;
    }
    return false;
  }

  isOktaAuthenticated() {
    const user = localStorage.getItem('okta-token-storage')
      ? JSON.parse(localStorage.getItem('okta-token-storage') || '{}')
      : null;

    if (!user) {
      return false;
    }
    const idToken = user?.idToken;
    const accessToken = user?.accessToken;

    return !!(
      idToken &&
      accessToken
    );
  }
}
