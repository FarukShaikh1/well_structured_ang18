import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePassword } from '../../interfaces/change-password';
import { UserLoginRequest } from '../../interfaces/user-login-request';
import { API_URL } from '../../../utils/api-url';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) {}

  authenticateUser(userLoginRequest: UserLoginRequest): Observable<any> {
    return this.httpService.post(API_URL.AUTHENTICATE_USER, userLoginRequest);
  }

  getAllUsers(): Observable<any> {
    return this.httpService.get(API_URL.GET_ALL_USERS);
  }

  getLoggedInUserDetails(): Observable<any> {
    return this.httpService.get(API_URL.GET_LOGGED_IN_USER_DETAILS);
  }

  getUserByIdOrEmail(value: string, isId: boolean): Observable<any> {
    if (isId) {
      return this.getUserDetailsById(value);
    } else {
      return this.getUserDetailsByEmail(value);
    }
  }

  getUserDetailsById(id: any): Observable<any> {
    return this.httpService.get(API_URL.GET_ALL_USERS + '?id=' + id);
  }

  getUserDetailsByEmail(email: string): Observable<any> {
    return this.httpService.get(API_URL.GET_ALL_USERS + '?email=' + email);
  }

  addUser(userData: any): Observable<any> {
    return this.httpService.post<any>(API_URL.REGISTER_USER, userData);
  }

  deactivateUser(id: string, isdeactivate: boolean): Observable<any> {
    if (isdeactivate) {
      return this.httpService.delete<any>(API_URL.DEACTIVATE_USER + id);
    } else {
      return this.httpService.delete<any>(API_URL.REACTIVATE_USER + id);
    }
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

  verifyOtp(emailId: string | null, otpCode: string): Observable<any> {
    const url = API_URL.VERIFY_OTP?.replace('{0}', emailId || '')?.replace('{1}', otpCode);
    return this.httpService.get<any>(url);
  }
}
