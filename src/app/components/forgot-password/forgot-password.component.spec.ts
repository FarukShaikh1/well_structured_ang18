import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ForgotPasswordComponent } from './forgot-password.component';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let userService: UserService;
  let loaderService: LoaderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ForgotPasswordComponent,
        RouterTestingModule,
        ReactiveFormsModule],
    providers: [
        UserService,
        LoaderService,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    loaderService = TestBed.inject(LoaderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the forgotPasswordForm with default values', () => {
    const forgotPasswordForm = component.forgotPasswordForm;
    expect(forgotPasswordForm).toBeTruthy();
    expect(forgotPasswordForm.controls['email']).toBeTruthy();
    expect(forgotPasswordForm.controls['email'].value).toBe('');
  });

  it('should show loader and call forgotPassword on valid form submission', fakeAsync(() => {
    const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
    const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
    const spyUserService = spyOn(userService, 'forgotPassword').and.returnValue(of({ success: true }));
    const spyToaster = spyOn(component.toaster, 'showMessage').and.callThrough();
    const spyRouter = spyOn(component['router'], 'navigate').and.callThrough();

    component.forgotPasswordForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    expect(spyLoaderShow).toHaveBeenCalled();
    expect(spyUserService).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(spyToaster).toHaveBeenCalledWith('Password reset link sent successfully', 'success');

    tick(2000); 

    expect(spyRouter).toHaveBeenCalledWith(['/']);
    expect(spyLoaderHide).toHaveBeenCalled();
  }));


  it('should not call forgotPassword on invalid form submission', () => {
    const spyUserService = spyOn(userService, 'forgotPassword');

    component.forgotPasswordForm.controls['email'].setValue('');
    component.onSubmit();

    expect(spyUserService).not.toHaveBeenCalled();
  });

  it('should handle error response from forgotPassword', () => {
    const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
    const errorResponse = { error: { errors: { ConfirmPassword: 'Error sending password reset link' } } };
    const spyUserService = spyOn(userService, 'forgotPassword').and.returnValue(throwError(errorResponse));
    const spyToaster = spyOn(component.toaster, 'showMessage').and.callThrough();

    component.forgotPasswordForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    expect(spyUserService).toHaveBeenCalled();
    expect(spyToaster).toHaveBeenCalledWith('Error sending password reset link', 'error');
    expect(spyLoaderHide).toHaveBeenCalled();
  });


  it('should navigate back on goBack', () => {
    const spyRouter = spyOn(component['router'], 'navigate').and.callThrough();

    component.goBack();

    expect(spyRouter).toHaveBeenCalledWith(['/']);
  });

  it('should show error message if response indicates failure', () => {
    const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
    const spyUserService = spyOn(userService, 'forgotPassword').and.returnValue(of({ success: false, message: 'Failed to send reset link' }));
    const spyToaster = spyOn(component.toaster, 'showMessage').and.callThrough();

    component.forgotPasswordForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    expect(spyUserService).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(spyToaster).toHaveBeenCalledWith('Failed to send reset link', 'error');
    expect(spyLoaderHide).toHaveBeenCalled();
  });

  it('should log error and show error message if forgotPassword throws an error', () => {
    const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
    const spyConsoleError = spyOn(console, 'error').and.callThrough();
    const errorResponse = { message: 'Network error' };
    const spyUserService = spyOn(userService, 'forgotPassword').and.returnValue(throwError(() => errorResponse)); 
    const spyToaster = spyOn(component.toaster, 'showMessage').and.callThrough();
  
    component.forgotPasswordForm.controls['email'].setValue('test@example.com');
    component.onSubmit();
  
    expect(spyUserService).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(spyConsoleError).toHaveBeenCalledWith('Could not send password reset link', errorResponse);
    expect(spyToaster).toHaveBeenCalledWith('Network error', 'error');
    expect(spyLoaderHide).toHaveBeenCalled();
  });
});
