import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as forms from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ApplicationConstants,
  Messages,
  NavigationURLs,
} from '../../../utils/application-constants';
import { LoaderService } from '../../services/loader/loader.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { LogoutService } from '../../services/logout/logout.service';
import { UserService } from '../../services/user/user.service';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { SiteUnderDevelopmentComponent } from '../shared/site-under-development/site-under-development.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    forms.ReactiveFormsModule,
    ToasterComponent,
    LoaderComponent,
    SiteUnderDevelopmentComponent,
    NgbCarouselModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  forgotPasswordForm: any;
  Constants: any = ApplicationConstants;
  Messages = Messages;

  constructor(
    private fb: forms.FormBuilder,
    private router: Router,
    private userService: UserService,
    private loaderService: LoaderService,
    private logoutService: LogoutService,
    private localStorageService: LocalStorageService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(ApplicationConstants.MIN_LENGTH_USERNAME),
          Validators.pattern(ApplicationConstants.PATTERN_REQUIRED_CHARS_IN_USERNAME),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.localStorageService.clear();
  }

  onSubmit(): void {
    this.loaderService.showLoader();
    if (this.forgotPasswordForm.valid) {
      const payload = {
        email: this.forgotPasswordForm.value.email,
      };

      this.userService.forgotPassword(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.toaster.showMessage(
              Messages.PASSWORD_RESET_LINK_SENT_MSG,
              'success'
            );
            setTimeout(() => {
              this.router.navigate([NavigationURLs.LOGIN]);
              this.loaderService.hideLoader();
            }, 2000);
          } else {
            this.toaster.showMessage(response?.message, 'error');
          }
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          if (error?.error?.errors?.ConfirmPassword) {
            console.error(
              'Could not send password reset link',
              error?.error?.errors?.ConfirmPassword
            );
            this.toaster.showMessage(
              error?.error?.errors?.ConfirmPassword,
              'error'
            );
          } else {
            console.error('Could not send password reset link', error);
            this.toaster.showMessage(error?.message, 'error');
          }
          this.loaderService.hideLoader();
        },
      });
    }
  }

  logout(): void {
    this.logoutService.logout();
  }
}
