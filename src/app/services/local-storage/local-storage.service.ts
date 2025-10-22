import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DdlConfig, LocalStorageConstants } from "../../../utils/application-constants";
import { ServiceResponse } from "../../interfaces/service-response";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  private currentUserSource = new BehaviorSubject<ServiceResponse | null>(null);

  constructor() { }

  clear(): void {
    localStorage.clear();
  }

  setLoggedInUserData(user: any) {
    this.currentUserSource.next(user);
  }

  getLoggedInUserData(): any {
    return localStorage.getItem(LocalStorageConstants.USER)
      ? JSON.parse(localStorage.getItem(LocalStorageConstants.USER) || "{}")
      : null;
  }

  isAuthenticated(): boolean {
    let isLoggedIn = localStorage.getItem(LocalStorageConstants.IS_LOGGED_IN) === 'true';
    if (!isLoggedIn) {
      return false;
    }
    const user = this.getLoggedInUserData();
    if (!user) {
      return false;
    }
    const loginToken = user?.token;
    const userName = user?.userName;
    const isUserLoggedIn = localStorage.getItem(LocalStorageConstants.USER) || null;

    return !!(
      
      (
        isUserLoggedIn !== null && 
        userName
      )
    );
  }

  setUserPermission(data: any[]) {
    localStorage.setItem(LocalStorageConstants.USER_PERMISSIONS, JSON.stringify(data));
  }

  getUserPermission(): any[] {
    return JSON.parse(localStorage.getItem(LocalStorageConstants.USER_PERMISSIONS) || "[]");
  }

  getConfigList(config: string): any[] {
    return JSON.parse(localStorage.getItem(config) || "[]");
  }

  setCountryList(data: any[]) {
    localStorage.setItem(DdlConfig.COUNTRIES, JSON.stringify(data));
  }

  getCountryList(): any[] {
    return JSON.parse(localStorage.getItem(DdlConfig.COUNTRIES) || "[]");
  }

  setCommonListItems(key: string, data: any[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getCommonListItems(key: string): any[] {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  getLoggedInUserRoleId(): string {
    return localStorage.getItem(LocalStorageConstants.USER_ROLE_ID) || "";
  }

  setLoggedInUserRoleId(loggedInUserRoleId: string) {
    localStorage.setItem(LocalStorageConstants.USER_ROLE_ID, loggedInUserRoleId);
  }

  getLoggedInUserPermissions(): any {
    return JSON.parse(localStorage.getItem(LocalStorageConstants.USER_PERMISSIONS) || "[]");
  }

  setLoggedInUserPermissions(permissions: any) {
    localStorage.setItem(LocalStorageConstants.USER_PERMISSIONS, permissions);
  }

  setTransactionSuggestions(data: any[]) {
    localStorage.setItem(DdlConfig.COMMON_SUGGESTIONS, JSON.stringify(data));
  }
  isUserAuthorized(): boolean {
    const userPermissions = this.getUserPermission();
    if (
      userPermissions &&
      Array.isArray(userPermissions) &&
      userPermissions.length > 0
    ) {
      return true;
    }
    return false;
  }

  isOktaAuthenticated() {
    const user = localStorage.getItem("okta-token-storage")
      ? JSON.parse(localStorage.getItem("okta-token-storage") || "{}")
      : null;

    if (!user) {
      return false;
    }
    const idToken = user?.idToken;
    const accessToken = user?.accessToken;

    return !!(idToken && accessToken);
  }
}
