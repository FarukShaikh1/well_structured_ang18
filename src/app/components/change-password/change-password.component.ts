import { Component, OnInit, ViewChild } from '@angular/core';
import * as forms from '@angular/forms';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
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
  imports: [forms.ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  changePasswordForm!: FormGroup;
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  userFullName: string = '';
  Messages = Messages;
  Constants = ApplicationConstants;
  ApplicationRoles = ApplicationRoles;
  userId: string = '';
  hasPasswordExpired = false;
  processing = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private loaderService: LoaderService,
    public globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private logoutService: LogoutService
  ) { }

  ngOnInit() {
    this.loaderService.showLoader();
    this.hasPasswordExpired = this.localStorageService.getLoggedInUserData()?.hasPasswordExpired;

    this.userId = this.localStorageService.getLoggedInUserData().userId;
    this.userFullName =
      this.localStorageService.getLoggedInUserData().userName;
    this.loaderService.hideLoader();

    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(ApplicationConstants.MIN_LENGTH_PASSWORD),
            Validators.pattern(
              ApplicationConstants.PATTERN_REQUIRED_CHARS_IN_PASSWORD
            ),
            this.passwordNotContainingName(this.userFullName), // Add the custom validator here
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [
          this.passwordMatchValidator,
          this.passwordNotSameValidator,
        ],
      }
    );

    this.loaderService.hideLoader();
  }

  getPasswordLengthMessage(): string {
    return Messages.PASSWORD_LENGTH_MSG.replace(
      '{0}',
      ApplicationConstants.MIN_LENGTH_PASSWORD.toString()
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (confirmPassword?.hasError('required')) {
      return;
    }

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      // Clear passwordMismatch error only if present
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
  }

  passwordNotContainingName(fullname: string): ValidatorFn {
    if (!fullname) {
      return () => null;
    }

    const nameParts = fullname
      .split(' ')
      .filter((part) => part.trim().length > 0);

    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value || '';

      if (!password) {
        return null;
      }

      // Check if the password contains any part of the name
      const containsNamePart = nameParts.some((part) =>
        password.toLowerCase().includes(part.toLowerCase())
      );

      return containsNamePart ? { nameContains: true } : null;
    };
  }

  passwordNotSameValidator: ValidatorFn = (
    form: AbstractControl
  ): ValidationErrors | null => {
    const oldPassword = form.get('oldPassword')?.value;
    const newPassword = form.get('newPassword')?.value;

    if (oldPassword && newPassword && oldPassword === newPassword) {
      form
        .get('newPassword')
        ?.setErrors({ ...form.get('newPassword')?.errors, sameAsOld: true });
      return { sameAsOld: true };
    } else {
      if (form.get('newPassword')?.hasError('sameAsOld')) {
        form.get('newPassword')?.setErrors(null); // Clear sameAsOld error if no longer applicable
      }
      return null;
    }
  };

  onSubmit(): void {
    this.processing = true;
    this.loaderService.showLoader();
    if (this.changePasswordForm.valid) {
      const payload: ChangePassword = {
        currentPassword: this.changePasswordForm.value.oldPassword,
        password: this.changePasswordForm.value.newPassword,
        confirmPassword: this.changePasswordForm.value.confirmPassword,
      };

      this.userService.changePassword(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.showMessage(response?.message + ' Please relogin with the new password.', 'success', 5000);
            setTimeout(() => {
              this.loaderService.hideLoader();
              this.logout();
            }, 3500);
          } else {
            this.processing = false;
            if (response?.message?.toLowerCase() === 'incorrect password.') {
              this.toaster.showMessage('Incorrect current password.', 'error');
            } else {
              this.toaster.showMessage(response?.message, 'error');
            }
            this.loaderService.hideLoader();
          }
        },
        error: (error: any) => {
          this.processing = false;
          if (error?.error?.errors?.ConfirmPassword) {
            this.toaster.showMessage(
              error?.error?.errors?.ConfirmPassword,
              'error'
            );
          } else {
            this.toaster.showMessage('Error in changing password.', 'error');
          }
          this.loaderService.hideLoader();
        },
      });
    }
  }

  navigateToHome() {
    this.router.navigate([NavigationURLs.HOME]);
  }

  logout() {
    this.logoutService.logout();
  }
}
