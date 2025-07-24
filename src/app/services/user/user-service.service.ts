import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLoginRequest } from '../../interfaces/user-login-request';
import { API_URL } from '../../../utils/api-url';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  loggedInUserId: number;
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }

  getUser(userLoginRequest: UserLoginRequest) {
    return this.http.post(API_URL.LOGIN , userLoginRequest);
  }

  updateUserDetails(userDetailsForm: any): Observable<any> {
    return this.http.post(API_URL.UPDATE_USER + 'updateUserDetails?userId=' + this.loggedInUserId, userDetailsForm);
  }

  getUserByUserId(id: number) {
    return API_URL.Get_USER_BY_USER_ID + id;
  }

  getLoggedInUserDetails() {
    return this.http.get(API_URL.Get_USER_DETAILS + this.loggedInUserId);
  }

  getUserList(): Observable<any> {
    return this.http.get(API_URL.Get_USER_LIST + this.loggedInUserId);
  }

  getRoleList(): Observable<any> {
    return this.http.get(API_URL.GET_ALL_ROLES + this.loggedInUserId);
  }

}
