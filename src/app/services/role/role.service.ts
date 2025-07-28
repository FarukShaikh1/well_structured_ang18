import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  loggedInUserId: string;


  constructor(private httpService: HttpService) { 
        this.loggedInUserId = String(localStorage.getItem("userId"));

  }
  getAllRoles(): Observable<any> {
    return this.httpService.get(API_URL.GET_ALL_ROLES);
  }

  getLoggedInUserPermissions(): Observable<any> {
    debugger
    return this.httpService.get(API_URL.GET_USER_PERMISSIONS+this.loggedInUserId);
  }

  getPermission(userId: string): Observable<any> {
    return this.httpService.get(API_URL.GET_USER_PERMISSIONS + userId);
  }

  updateUserPermission(data: any): Observable<any> {
    return this.httpService.post(API_URL.UPDATE_USER_PERMISSION, data);
  }
}
