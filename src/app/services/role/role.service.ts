import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { LocalStorageConstants } from '../../../utils/application-constants';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpService: HttpService) { }

  getAllRoles(): Observable<any> {
    return this.httpService.get(API_URL.GET_ALL_ROLES);
  }

  getLoggedInUserPermissions(): Observable<any> {
    const userString = localStorage.getItem(LocalStorageConstants.USER);
    let user = null;
    if (userString) {
      user = JSON.parse(userString);
    }
    return this.httpService.get(API_URL.GET_USER_PERMISSIONS + user?.id);
  }

  getPermission(userId: string): Observable<any> {
    return this.httpService.get(API_URL.GET_USER_PERMISSIONS + userId);
  }

  updateUserPermission(data: any): Observable<any> {
    return this.httpService.post(API_URL.UPDATE_USER_PERMISSION, data);
  }
}
