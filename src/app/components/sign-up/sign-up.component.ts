import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ToasterComponent } from '../shared/toaster/toaster.component';
import { UserRegistration } from '../../interfaces/user-registration';
import { RegistrationService } from '../../services/registration/registration.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToasterComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent {

  @ViewChild(ToasterComponent)
  toaster!: ToasterComponent;

  model: UserRegistration = this.getEmptyModel();

  selectedPhoto: File | null = null;

  isSubmitting = false;

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) { }

  getEmptyModel(): UserRegistration {
    return {
      id: '',
      dateOfBirth: '',
      name: '',
      email: '',
      mobileNumber: '',
      address: '',
      profilePhoto: '',

      emailVerified: false,
      status: '',

    };
  }

  onPhotoSelected(event: any): void {

    const file = event?.target?.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {

      this.toaster.showMessage(
        'Please select a valid image',
        'error'
      );

      return;
    }

    this.selectedPhoto = file;
  }

  submit(): void {

    if (!this.model.dateOfBirth) {
      this.toaster.showMessage(
        'Please enter your date of birth',
        'error'
      );
      return;
    }

    if (!this.model.name?.trim()) {
      this.toaster.showMessage(
        'Please enter your name',
        'error'
      );
      return;
    }

    if (!this.model.email?.trim()) {
      this.toaster.showMessage(
        'Please enter your email address',
        'error'
      );
      return;
    }

    if (!this.model.mobileNumber?.trim()) {
      this.toaster.showMessage(
        'Please enter your mobile number',
        'error'
      );
      return;
    }

    if (!this.model.address?.trim()) {
      this.toaster.showMessage(
        'Please enter your address',
        'error'
      );
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();

    formData.append(
      'dateOfBirth',
      this.model.dateOfBirth
    );

    formData.append(
      'name',
      this.model.name.trim()
    );

    formData.append(
      'email',
      this.model.email.trim()
    );

    formData.append(
      'mobileNumber',
      this.model.mobileNumber.trim()
    );

    formData.append(
      'address',
      this.model.address.trim()
    );

    if (this.selectedPhoto) {

      formData.append(
        'profilePhoto',
        this.selectedPhoto
      );

    }

    this.registrationService
      .register(formData)
      .subscribe({

        next: (res: any) => {

          this.isSubmitting = false;

          this.toaster.showMessage(
            'Registration submitted successfully. Please verify your email.',
            'success'
          );

          // Assuming API returns registrationId
          const registrationId =
            res?.registrationId || res;

          this.router.navigate(
            ['/verify-email'],
            {
              queryParams: {
                registrationId: registrationId
              }
            }
          );

        },

        error: (err) => {

          this.isSubmitting = false;

          console.error(
            'Registration failed',
            err
          );

          this.toaster.showMessage(
            err?.error?.message ||
            'Unable to submit registration',
            'error'
          );

        }

      });
  }

  clear(): void {

    this.model = this.getEmptyModel();

    this.selectedPhoto = null;

  }

}