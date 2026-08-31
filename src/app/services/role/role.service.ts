import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { LocalStorageConstants } from '../../../utils/application-constants';
import { UserPermission } from '../../interfaces/user-permission';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpService: HttpService) { }

  getAllRoles(): Observable<any> {
    return this.httpService.get(API_URL.GET_ALL_ROLES);
  }

  getPermission(userId: string | null): Observable<any> {
    if (userId == "") {
      const localStorageUserId = localStorage.getItem(LocalStorageConstants.USERID)?.toString();
      if (localStorageUserId != "" && localStorageUserId != undefined && localStorageUserId != "undefined") {
        userId = localStorageUserId ?? "";
      }
      else {
        const userString = localStorage.getItem(LocalStorageConstants.USER);
        let user = null;
        if (userString) {
          user = JSON.parse(userString);
          userId = user.userId;
        }
      }
      return this.httpService.get(API_URL.GET_USER_PERMISSIONS + userId);
    }
    return this.httpService.get(API_URL.GET_USER_PERMISSIONS + userId);
  }

  getDefaultPermission(): Observable<any> {
    return this.httpService.get(API_URL.GET_DEFAULT_PERMISSIONS);
  }

  updateUserPermission(data: UserPermission): Observable<any> {
    const userString = localStorage.getItem(LocalStorageConstants.USER);
    let user = null;
    if (userString) {
      user = JSON.parse(userString);
    }
    return this.httpService.post(API_URL.UPDATE_USER_PERMISSION, data);
  }
}
