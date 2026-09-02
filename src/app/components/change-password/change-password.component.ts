import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  ApplicationConstants,
  ApplicationRoles,
  Messages,
  NavigationURLs,
} from '../../../utils/application-constants';

import { ChangePassword } from '../../interfaces/change-password';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { LogoutService } from '../../services/logout/logout.service';
import { UserService } from '../../services/user/user.service';

import { LoaderComponent } from '../shared/loader/loader.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LoaderComponent,
    ToasterComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {

  @ViewChild(ToasterComponent)
  toaster!: ToasterComponent;

  changePasswordForm!: FormGroup;

  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  userFullName = '';
  userId: string | undefined;

  hasPasswordExpired = false;
  processing = false;

  Messages = Messages;
  Constants = ApplicationConstants;
  ApplicationRoles = ApplicationRoles;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private loaderService: LoaderService,
    public globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private logoutService: LogoutService
  ) {}

  ngOnInit(): void {

    const loggedInUser =
      this.localStorageService.getLoggedInUserData();

    this.hasPasswordExpired =
      loggedInUser?.hasPasswordExpired ?? false;

    this.userFullName =
      loggedInUser?.userName ?? '';

    this.userId =
      loggedInUser?.id;

    this.changePasswordForm = this.fb.group(
      {
        oldPassword: [
          '',
          [Validators.required]
        ],

        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(
              ApplicationConstants.MIN_LENGTH_PASSWORD
            ),
            Validators.pattern(
              ApplicationConstants.PATTERN_REQUIRED_CHARS_IN_PASSWORD
            ),
            this.passwordNotContainingName(this.userFullName)
          ]
        ],

        confirmPassword: [
          '',
          [Validators.required]
        ]
      },
      {
        validators: [
          this.passwordMatchValidator(),
          this.passwordNotSameValidator()
        ]
      }
    );
  }

  // ============================
  // PASSWORD LENGTH MESSAGE
  // ============================

  getPasswordLengthMessage(): string {

    return Messages.PASSWORD_LENGTH_MSG.replace(
      '{0}',
      ApplicationConstants.MIN_LENGTH_PASSWORD.toString()
    );
  }

  // ============================
  // PASSWORD MATCH VALIDATOR
  // ============================

  passwordMatchValidator(): ValidatorFn {

    return (
      form: AbstractControl
    ): ValidationErrors | null => {

      const newPassword =
        form.get('newPassword')?.value;

      const confirmPassword =
        form.get('confirmPassword')?.value;

      if (
        !newPassword ||
        !confirmPassword
      ) {
        return null;
      }

      return newPassword === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
  }

  // ============================
  // OLD PASSWORD != NEW PASSWORD
  // ============================

  passwordNotSameValidator(): ValidatorFn {

    return (
      form: AbstractControl
    ): ValidationErrors | null => {

      const oldPassword =
        form.get('oldPassword')?.value;

      const newPassword =
        form.get('newPassword')?.value;

      if (
        !oldPassword ||
        !newPassword
      ) {
        return null;
      }

      return oldPassword === newPassword
        ? { sameAsOld: true }
        : null;
    };
  }

  // ============================
  // PASSWORD SHOULD NOT CONTAIN NAME
  // ============================

  passwordNotContainingName(
    fullname: string
  ): ValidatorFn {

    if (!fullname) {
      return () => null;
    }

    const nameParts = fullname
      .split(' ')
      .map(x => x.trim())
      .filter(x => x.length > 0);

    return (
      control: AbstractControl
    ): ValidationErrors | null => {

      const password =
        control.value || '';

      if (!password) {
        return null;
      }

      const containsNamePart =
        nameParts.some(part =>
          password
            .toLowerCase()
            .includes(part.toLowerCase())
        );

      return containsNamePart
        ? { nameContains: true }
        : null;
    };
  }

  // ============================
  // SUBMIT
  // ============================

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.toaster.showMessage(
        'Please correct the validation errors.',
        'error'
      );
      return;
    }

    this.processing = true;
    this.loaderService.showLoader();
    const payload: ChangePassword = {
      oldPassword:
      this.changePasswordForm.value.oldPassword,
      newPassword:
        this.changePasswordForm.value.newPassword,
      userId:
        this.userId,
      modifiedBy:
        this.userId
    };

    this.userService.changePassword(payload)
      .subscribe({
        next: (response) => {
          debugger;
          this.processing = false;
          if (response?.success) {
            this.toaster.showMessage(
             response?.message ||
             'Password changed successfully. Please login again.',
             'success',
              5000
           );
            setTimeout(() => {
              this.loaderService.hideLoader();
              this.logout();
            }, 3500);
          } else {
            this.loaderService.hideLoader();
            this.toaster.showMessage(
             response?.message ||
              'Unable to change password.',
              'error'
            );
          }
        },

        error: (error: any) => {
          this.processing = false;
          this.loaderService.hideLoader();
          this.toaster.showMessage(
           error?.error?.message ||
            error?.error?.error ||
            'Error in changing password.',
            'error'
          );
        }
      });
  }

  // ============================
  // NAVIGATION
  // ============================

  navigateToHome(): void {

    this.router.navigate([
      NavigationURLs.HOME
    ]);
  }

  logout(): void {

    this.logoutService.logout();
  }

  // ============================
  // HELPERS FOR HTML
  // ============================

  get oldPasswordControl() {
    return this.changePasswordForm.get('oldPassword');
  }

  get newPasswordControl() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.changePasswordForm.get('confirmPassword');
  }

  get isPasswordMismatch(): boolean {

    return (
      this.changePasswordForm.hasError('passwordMismatch') &&
      !!this.confirmPasswordControl?.value
    );
  }

  get isSameAsOldPassword(): boolean {

    return (
      this.changePasswordForm.hasError('sameAsOld') &&
      !!this.newPasswordControl?.value
    );
  }
}