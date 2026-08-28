import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';
import { VerifyEmailRequest } from '../../interfaces/email-verification';
import { UserRegistration } from '../../interfaces/user-registration';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    constructor(
        private http: HttpClient
    ) { }

    register(data: FormData) {

        return this.http.post(
            API_URL.REGISTER,
            data
        );

    }

   verifyEmail(request: VerifyEmailRequest) {
    return this.http.post<any>(
      API_URL.VERIFY_EMAIL,
      request
    );
  }

    resendOtp(
        registrationId: string
    ) {

        return this.http.post(
            API_URL.RESEND_OTP,
            {
                registrationId
            }
        );
    }

     // =========================================================
  // GET PENDING USERS
  // =========================================================

  getPendingRegistrations() {
    return this.http.get<UserRegistration[]>(
      API_URL.GET_PENDING_USER_REGISTRATIONS
    );
  }


  // =========================================================
  // GET DETAILS
  // =========================================================

  getRegistrationDetails(registrationId: string) {
    return this.http.get<UserRegistration>(
      API_URL.GET_USER_REGISTRATION_DETAILS + registrationId
    );
  }


  // =========================================================
  // APPROVE
  // =========================================================

  approveRegistration(registrationId: string) {
    return this.http.post<any>(
      API_URL.APPROVE_USER_REGISTRATION + registrationId,
      {}
    );
  }


  // =========================================================
  // REJECT
  // =========================================================

  rejectRegistration(
    registrationId: string,
    reason: string
  ) {
    return this.http.post<any>(
      API_URL.REJECT_USER_REGISTRATION + registrationId,
      {
        reason: reason
      }
    );
  }
}