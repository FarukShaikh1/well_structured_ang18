import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { SendOtpRequest, VerifyOtpRequest } from '../../interfaces/otp-request ';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private httpService: HttpService) { }

  sendOtp(sendOtpRequest: SendOtpRequest) : Observable<any>{
    return this.httpService.post(
      API_URL.SEND_OTP,
      sendOtpRequest
    );
  }

  verifyOtp(verifyOtpRequest: VerifyOtpRequest): Observable<any> {
    const url = API_URL.VERIFY_OTP;
    return this.httpService.post<any>(url, verifyOtpRequest);
  }
}
