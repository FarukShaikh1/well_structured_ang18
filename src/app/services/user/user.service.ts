import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { ChangePassword } from '../../interfaces/change-password';
import { UserLoginRequest } from '../../interfaces/user-login-request';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) { }

  getAllUsers(): Observable<any> {
    return this.httpService.get(API_URL.GET_ALL_USERS);
  }

  getLoggedInUserDetails(): Observable<any> {
    return this.httpService.get(API_URL.GET_LOGGED_IN_USER_DETAILS);
  }

  getUserDetailsById(id: any): Observable<any> {

    return this.httpService.get(API_URL.Get_USER_DETAILS + id);
  }

  addUser(userData: any): Observable<any> {
    return this.httpService.post<any>(API_URL.REGISTER_USER, userData);
  }

  updateUser(userData: any): Observable<any> {
    return this.httpService.post<any>(API_URL.UPDATE_USER, userData);
  }

  resetPassword(userData: any): Observable<any> {
    return this.httpService.post<any>(API_URL.RESET_PASSWORD, userData);
  }

  forgotPassword(userData: any): Observable<any> {
    return this.httpService.post<any>(API_URL.FORGOT_PASSWORD, userData);
  }

  changePassword(changePassword: ChangePassword): Observable<any> {
    return this.httpService.post<any>(API_URL.CHANGE_PASSWORD, changePassword);
  }

  getUser(userLoginRequest: UserLoginRequest) {
    return this.httpService.post(API_URL.LOGIN, userLoginRequest);
  }

  updateUserDetails(userDetailsForm: any): Observable<any> {
    return this.httpService.post(API_URL.UPDATE_USER + 'updateUserDetails?userId=', userDetailsForm);
  }

  getUserList(): Observable<any> {
    return this.httpService.get(API_URL.GET_ALL_USERS);
  }

  getModuleList(): Observable<any> {
    return this.httpService.get(API_URL.GET_MODULE_LIST);
  }

  /**
   * Exchanges a refresh token for a new access + refresh token pair.
   * Called automatically by HttpInterceptorService on 401 responses.
   */
  refreshToken(refreshToken: string): Observable<any> {
    return this.httpService.post<any>(API_URL.REFRESH_TOKEN, { refreshToken });
  }

  /**
   * Revokes the current refresh token server-side. Call on explicit logout.
   */
  logout(refreshToken: string): Observable<any> {
    return this.httpService.post<any>(API_URL.LOGOUT, { refreshToken });
  }
}
