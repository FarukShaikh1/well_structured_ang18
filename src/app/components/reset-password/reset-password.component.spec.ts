import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { LoaderService } from '../../services/loader/loader.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToasterComponent } from '../shared/toaster/toaster.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockUserService: any;
  let mockLoaderService: any;
  let mockToaster: any;
  let loaderService: LoaderService;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockActivatedRoute = {
      queryParamMap: of({
        get: (param: string) => {
          if (param === 'token') { return 'mockToken'; }
          if (param === 'email') { return 'mockEmail'; }
          if (param === 'resetPassword') { return 'true'; }
          return null;
        }
      })
    };

    mockUserService = jasmine.createSpyObj('UserService', ['resetPassword']);
    mockLoaderService = jasmine.createSpyObj('LoaderService', ['showLoader', 'hideLoader']);
    mockToaster = jasmine.createSpyObj('ToasterComponent', ['showMessage']);

    await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, ResetPasswordComponent, ToasterComponent],
    providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UserService, useValue: mockUserService },
        LoaderService,
        { provide: ToasterComponent, useValue: mockToaster } 
        ,
        provideHttpClient(withInterceptorsFromDi())
    ]
}).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;

    const toasterFixture = TestBed.createComponent(ToasterComponent);
    component.toaster = toasterFixture.componentInstance;

    loaderService = TestBed.inject(LoaderService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('ngOnInit(): should initialize component and set properties on ngOnInit', () => {
    component.ngOnInit();

    expect(component.token).toBe('mockToken');
    expect(component.email).toBe('mockEmail');
    expect(component.isResetPassword).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled(); 
  });

  it('ngOnInit(): should navigate to /unauthorised if token or email is missing', () => {
    mockActivatedRoute.queryParamMap = of({
      get: () => null 
    });

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorised']);
  });

  describe('disallowedCharactersValidator', () => {
    it('should return null if control value is empty', () => {
      const validator = component.disallowedCharactersValidator([' ', '#']);
      const control = new FormControl('');
      const result = validator(control);
      expect(result).toBeNull();
    });


    it('should return null if control value does not contain disallowed characters', () => {
      const validator = component.disallowedCharactersValidator([' ', '#']);
      const control = new FormControl('validPassword123');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return an error object if control value contains disallowed characters', () => {
      const validator = component.disallowedCharactersValidator([' ', '#']);
      const control = new FormControl('invalid#Password');
      const result = validator(control);
      expect(result).toEqual({ disallowedCharacters: ['#'] });
    });

    it('should return multiple disallowed characters in the error object', () => {
      const validator = component.disallowedCharactersValidator([' ', '#', '^']);
      const control = new FormControl('invalid#Password^');
      const result = validator(control);
      expect(result).toEqual({ disallowedCharacters: ['#', '^'] });
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.ngOnInit(); 
      component.resetPasswordForm.controls['newPassword'].setValue('ValidPassword123!');
      component.resetPasswordForm.controls['confirmPassword'].setValue('ValidPassword123!');
    });

    it('should call resetPassword on UserService and navigate on success', () => {
      const spyToaster = spyOn(component.toaster, 'showMessage').and.callThrough();
      const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();

      mockUserService.resetPassword.and.returnValue(of({ success: true }));

      component.onSubmit();

      expect(spyLoaderShow).toHaveBeenCalled();
      expect(mockUserService.resetPassword).toHaveBeenCalledWith({
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
        email: 'mockEmail',
        token: 'mockToken',
      });
      expect(spyToaster).toHaveBeenCalledWith('Password reset successful', 'success');
      
    });

    it('should show error message on failed password reset', () => {
      const spyToaster = spyOn(component.toaster, 'showMessage').and.callThrough();
      const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
      const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
      mockUserService.resetPassword.and.returnValue(of({ success: false, message: 'Password reset failed' }));

      component.onSubmit();

      expect(spyLoaderShow).toHaveBeenCalled();
      expect(spyToaster).toHaveBeenCalledWith('Password reset failed', 'error');
      expect(spyLoaderHide).toHaveBeenCalled();
    });

    it('should handle error response from the server', () => {
      const spyToaster = spyOn(component.toaster, 'showMessage').and.callThrough();
      const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
      const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();

      const errorResponse = { error: { errors: { ConfirmPassword: 'Confirmation password does not match' } } };
      mockUserService.resetPassword.and.returnValue(throwError(errorResponse));

      component.onSubmit();

      expect(spyLoaderShow).toHaveBeenCalled();
      expect(spyToaster).toHaveBeenCalledWith('Confirmation password does not match', 'error');
      expect(spyLoaderHide).toHaveBeenCalled();
    });

    it('should call resetPassword on UserService and navigate on success after timeout', fakeAsync(() => {
      
      component.ngOnInit(); 
      component.resetPasswordForm.controls['newPassword'].setValue('ValidPassword123!');
      component.resetPasswordForm.controls['confirmPassword'].setValue('ValidPassword123!');
      mockUserService.resetPassword.and.returnValue(of({ success: true }));

      
      component.onSubmit();
      tick(); 

      
      expect(mockLoaderService.showLoader).toHaveBeenCalled();
      expect(mockUserService.resetPassword).toHaveBeenCalledWith({
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
        email: 'mockEmail',
        token: 'mockToken',
      });
      expect(mockToaster.showMessage).toHaveBeenCalledWith('Password reset successful', 'success');

      
      tick(2000); 

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      expect(mockLoaderService.hideLoader).toHaveBeenCalled();
    }));

    it('should handle generic error response from the server', fakeAsync(() => {
      
      component.ngOnInit(); 
      component.resetPasswordForm.controls['newPassword'].setValue('ValidPassword123!');
      component.resetPasswordForm.controls['confirmPassword'].setValue('ValidPassword123!');

      const errorResponse = { message: 'An unexpected error occurred' };
      mockUserService.resetPassword.and.returnValue(throwError(errorResponse));

      
      component.onSubmit();
      tick(); 

      
      expect(mockLoaderService.showLoader).toHaveBeenCalled();
      expect(mockUserService.resetPassword).toHaveBeenCalledWith({
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
        email: 'mockEmail',
        token: 'mockToken',
      });
      expect(mockToaster.showMessage).toHaveBeenCalledWith('An unexpected error occurred', 'error');
      expect(mockLoaderService.hideLoader).toHaveBeenCalled();
    }));


    it('should hide loader if form is invalid', () => {
      const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
      component.resetPasswordForm.controls['newPassword'].setValue(''); 

      component.onSubmit();

      expect(spyLoaderShow).toHaveBeenCalled();
      expect(mockUserService.resetPassword).not.toHaveBeenCalled();
    });
  });

  it('goBack(): should navigate to the root route on goBack', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

});