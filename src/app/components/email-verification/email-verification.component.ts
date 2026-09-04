import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToasterComponent } from '../shared/toaster/toaster.component';
import { RegistrationService } from '../../services/registration/registration.service';
import { VerifyEmailRequest } from '../../interfaces/email-verification';
import { LogoutService } from '../../services/logout/logout.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToasterComponent
  ],
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  @ViewChild(ToasterComponent)
  toaster!: ToasterComponent;

  registrationId: string = '';

  otp: string = '';

  isLoading = false;

  isVerified = false;
  verificationOtp: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logoutService: LogoutService,
    private registrationService: RegistrationService
  ) {
  }

  ngOnInit(): void {
    this.registrationId = this.route.snapshot.queryParamMap.get('registrationId') || '';
    this.verificationOtp = this.route.snapshot.queryParamMap.get('verificationOtp') || '';

    if (!this.registrationId) {

      this.toaster?.showMessage(
        'Invalid registration request.',
        'error'
      );
    }
    if (this.verificationOtp) {
      this.otp = this.verificationOtp;
    }
  }

  logout(): void {
    this.logoutService.logout();
  }

  verify(): void {
    if (!this.registrationId) {
      this.toaster.showMessage(
        'Invalid registration request.',
        'error'
      );
      return;
    }


    if (!this.otp || this.otp.length !== 6) {

      this.toaster.showMessage(
        'Please enter a valid 6 digit OTP.',
        'error'
      );

      return;
    }
    this.isLoading = true;
    const verifyEmailRequest: VerifyEmailRequest = {
      registrationId: this.registrationId,
      otp: this.otp
    }
    this.registrationService.verifyEmail(verifyEmailRequest)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.isVerified = true;
          this.toaster.showMessage(res?.message || 'Email verified successfully.', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          this.toaster.showMessage(err?.error?.error || 'Invalid or expired OTP.', 'error');
        }
      });
  }


  clearOtp(): void {
    this.otp = '';
  }


  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  onOtpInput(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.otp = input.value.replace(/\D/g, '').substring(0, 6);

    input.value = this.otp;
  }

}