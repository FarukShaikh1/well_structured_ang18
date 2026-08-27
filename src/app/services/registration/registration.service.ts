import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    private http: HttpClient
  ) {}

  register(data: FormData) {

    return this.http.post(
      API_URL.REGISTER,
      data
    );

  }

  verifyEmail(
    registrationId: string,
    otp: string
  ) {

    return this.http.post(
      API_URL.VERIFY_EMAIL,
      {
        registrationId,
        otp
      }
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

}