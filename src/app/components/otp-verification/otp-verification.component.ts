import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LocalStorageConstants, NavigationURLs, OtpConfig } from '../../../utils/application-constants';
import { SendOtpRequest, VerifyOtpRequest } from '../../interfaces/otp-request ';
import { UserLoginRequest } from '../../interfaces/user-login-request';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { OtpService } from '../../services/otp/otp.service';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToasterComponent
  ],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css',
})
export class OTPVerificationComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  loginRequest!: UserLoginRequest;

  @ViewChild('firstOtpInput') firstInput!: ElementRef<HTMLInputElement>;

  otpForm: FormGroup = new FormGroup({});
  controlNames: string[] = [];
  maskedEmail: string | null | undefined = '';
  timerDisplay: string = '';
  timerSubscription!: Subscription;
  isOtpEntered: boolean = false;
  timerActive: boolean = true;
  otpResent: boolean = false;
  invalidOtp: boolean = false;
  verifyOtpRequest: VerifyOtpRequest = {
    emailId: '',
    otpCode: '',
    purpose: OtpConfig.LOGIN
  }
  private isUserNavigatingAway: boolean = false;
  enteredEmail: any;
  otpExpiresAt: any;
  userId: any;
  sendOtpRequest: SendOtpRequest = {
    EmailId: '',
    Purpose: OtpConfig.LOGIN
  };

  constructor(
    private router: Router,
    private otpService: OtpService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    public globalService: GlobalService
  ) { }

  ngOnInit() {
    this.enteredEmail = this.localStorageService.getLoggedInUserData()?.emailAddress;
    this.userId = this.localStorageService.getLoggedInUserData()?.id;
    this.otpExpiresAt = Number(localStorage.getItem(LocalStorageConstants.OTP_EXPIRES_ON));

    if (!this.enteredEmail) {
      this.onBackToLogin();
      return;
    }
    this.maskedEmail = this.maskEmail(this.enteredEmail);

    for (let i = 0; i < OtpConfig.NumberOfOtpDigits; i++) {
      const controlName = `otp${i}`;
      this.otpForm.addControl(
        controlName,
        new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]'),
        ])
      );
      this.controlNames.push(controlName);
    }
    this.startOtpTimer();
    this.loaderService.hideLoader();
  }

  startOtpTimer() {
    const now = Date.now();
    if (this.otpExpiresAt > now) {
      const durationInSeconds = Math.floor((this.otpExpiresAt - now) / 1000);
      this.startTimer(durationInSeconds);
    } else {
      // already expired
      this.timerActive = false;
      this.timerDisplay = "0:00";
    }
  }
  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerActive = false;
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  ngAfterViewInit() {
    this.focucToInput();
  }


  private handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (!this.isUserNavigatingAway) {

      const confirmationMessage =
        'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = confirmationMessage;

    }
  };


  navigateAway(): void {
    this.isUserNavigatingAway = true;

  }

  focucToInput() {
    if (this.firstInput) {
      this.firstInput.nativeElement.focus();
    }
  }

  maskEmail(email: string | null): string {
    if (!email || email.trim() === '') {
      return '-';
    }

    const [localPart, domain] = email.split('@');

    if (!localPart || !domain) {
      return '-';
    }


    const maskedLocalPart =
      localPart.slice(0, 1) + '******' + localPart.slice(-2);
    return `${maskedLocalPart}@${domain}`;
  }

  startTimer(durationInSeconds: number) {
    this.timerActive = true;
    this.timerSubscription = interval(1000)
      .pipe(
        take(durationInSeconds),
        map((elapsed) => durationInSeconds - elapsed - 1)
      )
      .subscribe((remainingTime) => {
        if (remainingTime <= 0) {
          this.timerActive = false;
        }
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        this.timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      });
  }

  onOtpInput(event: any, index: number) {
    this.invalidOtp = false;
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === OtpConfig.NumberOfOtpDigits) {
      value.split('').forEach((digit, i) => {
        const control = this.otpForm.get(`otp${i}`);
        if (control) {
          control.setValue(digit);
        }
      });
      this.isOtpEntered = true;
      return;
    }


    if (value && index < OtpConfig.NumberOfOtpDigits - 1) {
      const nextInput = document.getElementById(
        `otp${index + 1}`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    this.isOtpEntered = Object.values(this.otpForm.controls).every(
      (control) => control.valid
    );
  }

  onOtpPaste(event: ClipboardEvent, index: number) {
    this.invalidOtp = false;
    const clipboardData = event.clipboardData;
    const pastedData = clipboardData?.getData('text');
    if (pastedData && OtpConfig.NumberOfOtpDigits !== null) {
      const otpArray = pastedData.slice(0, OtpConfig.NumberOfOtpDigits).split('');
      otpArray.forEach((digit, idx) => {
        const controlName = `otp${index + idx}`;
        if (this.otpForm.get(controlName)) {
          this.otpForm.get(controlName)?.setValue(digit);
        }
      });

      this.isOtpEntered = Object.values(this.otpForm.controls).every(
        (control) => control.valid
      );

      const lastInputIndex = Math.min(
        index + otpArray.length - 1,
        OtpConfig.NumberOfOtpDigits - 1
      );
      const lastInput = document.getElementById(`otp${lastInputIndex}`);
      if (lastInput) {
        (lastInput as HTMLInputElement).focus();
      }
    }
    event.preventDefault();
  }

  onResendOtp(): void {
    this.loaderService.showLoader();
    this.invalidOtp = false;
    this.otpForm.reset();
    this.stopTimer();
    // this.otpResent = true;
    this.sendOtpRequest =
    {
      EmailId: this.enteredEmail,
      Purpose: OtpConfig.LOGIN
    }
    this.otpService.sendOtp(this.sendOtpRequest).subscribe({
      next: (result: any) => {
        if (result.success) {
          localStorage.setItem(
            LocalStorageConstants.OTP_EXPIRES_ON,
            (Date.now() + OtpConfig.OTP_EXPIRES_IN_MINUTES * 60 * 1000).toString()
          );
          this.focucToInput();
          this.startOtpTimer();
          this.loaderService.hideLoader();
          this.toaster.showMessage(
            'An OTP has been sent to your registered email ID',
            'success',
            5000
          );
        } else {
          this.toaster.showMessage(`${result?.message}`, 'error', 6000);
          this.loaderService.hideLoader();
        }
      },

      error: (_error: any) => {
        this.loaderService.hideLoader();

        this.toaster.showMessage(
          'Error in resending OTP, please try again.',
          'error'
        );
        return;
      },
    });
  }

  isFormValid(): boolean {
    return Object.values(this.otpForm.controls).every(
      (control) => control.value
    );
  }

  getOtp(): string {
    return Object.values(this.otpForm.value).join('');
  }

  onVerifyOtp() {
    const otp = this.getOtp();
    this.verifyOtpRequest = {
      emailId: this.localStorageService.getLoggedInUserData()?.emailAddress,
      otpCode: otp,
      purpose: OtpConfig.LOGIN
    }
    this.loaderService.showLoader();
    if (otp.length === OtpConfig.NumberOfOtpDigits && this.verifyOtpRequest.emailId) {
      this.callVerifyOtpApi(this.verifyOtpRequest);
    } else {
      this.loaderService.hideLoader();
      this.onBackToLogin();
    }
  }

  callVerifyOtpApi(verifyOtpRequest: VerifyOtpRequest) {
    this.otpService.verifyOtp(verifyOtpRequest).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.toaster.showMessage(
            'OTP verified successfully.',
            'success'
          );
            localStorage.setItem(LocalStorageConstants.IS_LOGGED_IN,'true');
          this.globalService.setValuesInLocalStorage();
          this.router.navigate([NavigationURLs.HOME]);

        }
        else {
           this.toaster.showMessage(
          'Error in verifying OTP, please try again later.',
          'error'
        );
            localStorage.setItem(LocalStorageConstants.IS_LOGGED_IN,'false');
          if (result.data.otpTrialCounter >= OtpConfig.otpMaxTrial) {

            this.onBackToLogin();
            this.loaderService.hideLoader();
          } else {
            this.invalidOtp = true;
            this.loaderService.hideLoader();
          }
        }
      },
      error: (_error: any) => {
        this.loaderService.hideLoader();
        this.toaster.showMessage(
          'Error in verifying OTP, please try again later.',
          'error'
        );
        return;
      },
    });
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    this.invalidOtp = false;

    if (event.key === 'Backspace') {
      if (input.value) {
        this.otpForm.get(`otp${index}`)?.setValue('');
      } else if (index > 0) {
        const previousInput = document.getElementById(
          `otp${index - 1}`
        ) as HTMLInputElement;
        if (previousInput) {
          previousInput.focus();
        }
      }
    }

    this.isOtpEntered = Object.values(this.otpForm.controls).every(
      (control) => control.valid
    );
  }

  onBackToLogin() {
    this.otpForm.reset();
    this.stopTimer();
    this.router.navigate([NavigationURLs.LOGIN]);
    this.localStorageService.clear();
  }
}
