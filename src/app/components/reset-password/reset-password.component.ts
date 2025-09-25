import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { UserService } from '../../services/user/user.service';
import { Messages, ApplicationConstants } from '../../../utils/application-constants';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToasterComponent,
    LoaderComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  resetPasswordForm!: FormGroup;
  token: string | null = null;
  email: string | null = null;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  isResetPassword: boolean = false;
  personName: string = '';
  Messages = Messages;
  Constants = ApplicationConstants;
  newPasswordPlaceHolder = '';
  confirmPasswordPlaceHolder = '';

  disallowedChars = [' ', '#', '^', '(', ')', '+', '{', '}'];
  passwordPolicyMessage1: string =
    'Your password must be at least 12 characters long, include uppercase letters, lowercase letters, numbers, and special characters. It should not contain your first or last name.';

  passwordPolicyMessage: string = `
  <ul style="padding: 0; margin: 0; list-style-type: none;">
    <li>Password must be at least <b>12 characters</b> long.</li>
    <li>Password must include <b>uppercase letters</b>, <b>lowercase letters</b>, <b>numbers</b>, and <b>special characters</b> (!@#$%^&*).</li>
    <li>Password must not contain user's <b>firstname</b> or <b>lastname</b>.</li>
  </ul>`;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private loaderService: LoaderService,
    public globalService: GlobalService,
    private localStorageService: LocalStorageService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.localStorageService.clear();
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token')
        ? decodeURIComponent(params.get('token') as string)
        : null;
      this.email = params.get('email')
        ? decodeURIComponent(params.get('email') as string)
        : null;
      const resetPasswordParam = params.get('iswelcome')
        ? decodeURIComponent(params.get('iswelcome') as string)
        : '';
      this.personName = params.get('name')
        ? decodeURIComponent(params.get('name') as string)
        : '';

      if (resetPasswordParam === 'true') {
        this.isResetPassword = false;
        this.newPasswordPlaceHolder = 'Enter Password';
        this.confirmPasswordPlaceHolder = 'Re-enter the Password';
        this.titleService.setTitle('Create Password');
      } else {
        this.isResetPassword = true;
        this.newPasswordPlaceHolder = 'Enter New Password';
        this.confirmPasswordPlaceHolder = 'Re-enter the New Password';
        this.titleService.setTitle('Reset Password');
      }
      if (!this.token || !this.email) {
        this.router.navigate(['/unauthorised']);
      }
    });

    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(ApplicationConstants.MIN_LENGTH_PASSWORD),
            Validators.pattern(
              ApplicationConstants.PATTERN_REQUIRED_CHARS_IN_PASSWORD
            ),
            this.passwordNotContainingName(this.personName), 
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngAfterViewInit(): void {
    
    
    
    
    
    
    
    
  }

  getPasswordLengthMessage(): string {
    return Messages.PASSWORD_LENGTH_MSG.replace(
      '{0}',
      ApplicationConstants.MIN_LENGTH_PASSWORD.toString()
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
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

      
      const containsNamePart = nameParts.some((part) =>
        password.toLowerCase().includes(part.toLowerCase())
      );

      return containsNamePart ? { nameContains: true } : null;
    };
  }

  onSubmit(): void {
    this.loaderService.showLoader();
    if (this.resetPasswordForm.valid) {
      const payload = {
        password: this.resetPasswordForm.value.password,
        confirmPassword: this.resetPasswordForm.value.confirmPassword,
        email: this.email,
        token: this.token,
      };

      this.userService.resetPassword(payload).subscribe({
        next: (response) => {
          if (response.success) {
            if (this.isResetPassword) {
              this.toaster.showMessage(
                Messages.PASSWORD_RESET_SUCCESSFULLY,
                'success'
              );
            } else {
              this.toaster.showMessage(
                Messages.PASSWORD_CREATED_SUCCESSFULLY,
                'success'
              );
            }
            setTimeout(() => {
              this.router.navigate(['/']);
              this.loaderService.hideLoader();
            }, 2000);
          } else {
            if (this.isResetPassword) {
              console.error(Messages.PASSWORD_RESET_FAILED, response?.message);
            } else {
              console.error(
                Messages.PASSWORD_CREATION_FAILED,
                response?.message
              );
            }
            this.toaster.showMessage(response?.message, 'error');
            this.loaderService.hideLoader();
          }
        },
        error: (error : any) => {
          if (error?.error?.errors?.ConfirmPassword) {
            console.error(
              Messages.PASSWORD_RESET_FAILED,
              error?.error?.errors?.ConfirmPassword
            );
            this.toaster.showMessage(
              error?.error?.errors?.ConfirmPassword,
              'error'
            );
          } else {
            console.error(Messages.PASSWORD_RESET_FAILED, error);
            this.toaster.showMessage(error?.message, 'error');
          }
          this.loaderService.hideLoader();
        },
      });
    }
  }
}
