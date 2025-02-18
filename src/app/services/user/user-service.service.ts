import { Injectable } from '@angular/core';
import * as constants from '../../../utils/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentDev } from '../../../environments/environment.dev';
import { UserLoginRequest } from '../../interfaces/user-login-request';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  baseUrl = environmentDev.serverUrl;
  loggedInUserId: number;
  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem("userId"));
  }

  getUser(userLoginRequest: UserLoginRequest) {
    debugger
    return this.http.post(this.baseUrl + constants.USERURL + 'getUser',userLoginRequest);
  }

  updateUserDetails(userDetailsForm: any): Observable<any> {
    return this.http.post(this.baseUrl + constants.USERURL + 'updateUserDetails?userId=' + this.loggedInUserId, userDetailsForm);
  }

  getUserByUserId(id: number) {
    return this.baseUrl + constants.USERURL + 'getUserByUserId?userId=' + id;
  }

  getLoggedInUserDetails() {
    return this.http.get(this.baseUrl + constants.USERURL + 'GetUserDetails?userId=' + this.loggedInUserId);
  }

  getUserList(): Observable<any> {
    return this.http.get(this.baseUrl + constants.USERURL + 'getUserList?userId=' + this.loggedInUserId);
  }

  getRoleList(): Observable<any> {
    return this.http.get(this.baseUrl + constants.USERURL + 'getRoleList?userId=' + this.loggedInUserId);
  }

}
