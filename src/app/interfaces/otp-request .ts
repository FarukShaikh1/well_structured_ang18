export interface VerifyOtpRequest {
  emailId: string;
  otpCode: string;
  purpose?: string; 
}

export interface SendOtpRequest
{
    EmailId : string;
    Purpose : string;
  }

 export interface ResetPasswordWithOtpRequest
 {
    EmailId : string;
    OtpCode : string;
    NewPassword : string;
 }