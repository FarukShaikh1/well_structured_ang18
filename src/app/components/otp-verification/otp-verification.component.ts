import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
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
import { UserLoginRequest } from '../../interfaces/user-login-request';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { UserService } from '../../services/user/user.service';
import { NavigationURLs } from '../../../utils/application-constants';
import { DateUtils } from '../../../utils/date-utils';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToasterComponent,
    LoaderComponent,
  ],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css',
})
export class OTPVerificationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @Input() numberOfOtpDigits: number | null = 0;
  @Input() otpExpiryTimeInMinutes: number | null = 0;
  @Input() otpMaxTrial!: number;//= 0;
  
  @Input() loginRequest!: UserLoginRequest;

  @ViewChild('firstOtpInput') firstInput!: ElementRef<HTMLInputElement>;
  @Output() backToLogin: EventEmitter<void> = new EventEmitter<void>();

  otpForm: FormGroup = new FormGroup({});
  controlNames: string[] = []; // List of control names for the form
  maskedEmail: string | null | undefined = '';
  timerDisplay: string = '';
  timerSubscription!: Subscription;
  isOtpEntered: boolean = false;
  timerActive: boolean = true;
  otpResent: boolean = false;
  invalidOtp: boolean = false;

  private isUserNavigatingAway: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    public globalService: GlobalService
  ) {}

  ngOnInit() {
    this.otpMaxTrial = 3;
    this.maskedEmail = this.maskEmail(this.loginRequest?.email);

    // Initialize OTP form controls dynamically
    if (this.numberOfOtpDigits !== null) {
      for (let i = 0; i < this.numberOfOtpDigits; i++) {
        const controlName = `otp${i}`;
        this.otpForm.addControl(
          controlName,
          new FormControl('', [
            Validators.required,
            Validators.pattern('[0-9]'),
          ])
        );
        this.controlNames.push(controlName); // Keep track of control names
      }
    }

    this.startOtpTimer();

    //Use this to show confirmation message before reloading the page.
    // window.addEventListener('beforeunload', this.handleBeforeUnload);

    this.loaderService.hideLoader();
  }

  startOtpTimer() {
    if (this.otpExpiryTimeInMinutes !== null) {
      this.startTimer(this.otpExpiryTimeInMinutes * 60);
    }
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Stop the timer
      this.timerActive = false; // Update the timer state
    }
  }

  ngOnDestroy() {
    //Use this while showing confirmation message before reloading the page.
    // window.removeEventListener('beforeunload', this.handleBeforeUnload);

    this.stopTimer();
  }

  ngAfterViewInit() {
    this.focucToInput();
  }

  //Use this to show a confirmation message before reloading the page.
  private handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (!this.isUserNavigatingAway) {
      // Display confirmation dialog
      const confirmationMessage =
        'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = confirmationMessage; // For legacy browsers
      //***** Modern browsers don't display the custom message but still show a generic dialog. ****
    }
  };

  // Simulate navigation to another page
  navigateAway(): void {
    this.isUserNavigatingAway = true;
    // Perform navigation logic here
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

    // Mask the local part of the email
    const maskedLocalPart =
      localPart.slice(0, 1) + '******' + localPart.slice(-2);
    return `${maskedLocalPart}@${domain}`;
  }

  startTimer(duration: number) {
    this.timerActive = true; // Start the timer
    this.timerSubscription = interval(1000)
      .pipe(
        take(duration),
        map((elapsed) => duration - elapsed - 1)
      )
      .subscribe((remainingTime) => {
        if (remainingTime === 0) {
          this.timerActive = false; // Timer has ended
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

    // If pasting a copied OTP
    if (value.length === this.numberOfOtpDigits) {
      value.split('').forEach((digit, i) => {
        const control = this.otpForm.get(`otp${i}`);
        if (control) {
          control.setValue(digit);
        }
      });
      this.isOtpEntered = true;
      return;
    }

    // Move focus to next input
    if (this.numberOfOtpDigits !== null) {
      if (value && index < this.numberOfOtpDigits - 1) {
        const nextInput = document.getElementById(
          `otp${index + 1}`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }

    // Check if OTP is fully entered
    this.isOtpEntered = Object.values(this.otpForm.controls).every(
      (control) => control.valid
    );
  }

  onOtpPaste(event: ClipboardEvent, index: number) {
    this.invalidOtp = false;
    const clipboardData = event.clipboardData;
    const pastedData = clipboardData?.getData('text');
    if (pastedData && this.numberOfOtpDigits !== null) {
      const otpArray = pastedData.slice(0, this.numberOfOtpDigits).split('');
      otpArray.forEach((digit, idx) => {
        const controlName = `otp${index + idx}`;
        if (this.otpForm.get(controlName)) {
          this.otpForm.get(controlName)?.setValue(digit);
        }
      });

      // Update the form validity and enable the "Verify OTP" button if valid
      this.isOtpEntered = Object.values(this.otpForm.controls).every(
        (control) => control.valid
      );

      // Focus the last input field of the pasted OTP
      const lastInputIndex = Math.min(
        index + otpArray.length - 1,
        this.numberOfOtpDigits - 1
      );
      const lastInput = document.getElementById(`otp${lastInputIndex}`);
      if (lastInput) {
        (lastInput as HTMLInputElement).focus();
      }
    }
    event.preventDefault(); // Prevent the default paste action
  }

  onResendOtp(): void {
    this.loaderService.showLoader();
    this.invalidOtp = false;
    this.otpForm.reset();
    this.stopTimer();
    this.otpResent = true;
    this.userService.authenticateUser(this.loginRequest).subscribe({
      next: (result: any) => {
        this.localStorageService.clear();
        if (result.success) {
          const data = result.data;
          this.numberOfOtpDigits = data.otpDigitsLength
            ? data.otpDigitsLength
            : 0;
          this.otpExpiryTimeInMinutes = data.otpExpiryTime
            ? DateUtils.convertTimeToMinutesSafe(data.otpExpiryTime)
            : 0;
          this.focucToInput();
          this.startOtpTimer();
          this.loaderService.hideLoader();
          this.toaster.showMessage(
            'An OTP has been sent to your registered email ID. Resend OTP link is allowed only once and has already been used.',
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
    this.loaderService.showLoader();
    const otp = this.getOtp();
    if (otp.length === this.numberOfOtpDigits && this.loginRequest?.email) {
      this.callVerifyOtpApi(otp);
    } else {
      this.loaderService.hideLoader();
    }
  }

  callVerifyOtpApi(otp: string) {
    this.userService.verifyOtp(this.loginRequest?.email, otp).subscribe({
      next: (result: any) => {
        this.localStorageService.clear();
        if (result.success) {
          const isSsoLogin = false;
          const isUserLoggedIn = true;
          this.localStorageService.setCurrentUser(
            result?.data,
            isUserLoggedIn,
            isSsoLogin
          );

          this.router.navigate([NavigationURLs.HOME]);
          // this.loaderService.hideLoader();
        } else {
          if (result.data.otpTrialCounter >= this.otpMaxTrial) {
            // this.toaster.showMessage('Otp retry limit exceeded.', 'error');
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
    this.backToLogin.emit(); // Emit the back to login event
  }
}
