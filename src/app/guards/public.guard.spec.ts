import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { publicGuard } from './public.guard';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { GlobalService } from '../services/global/global.service';
import { GlobalErrorHandlerService } from '../services/error-handling/global-error-handler.service';

describe('publicGuard', () => {
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let globalErrorHandlerSpy: jasmine.SpyObj<GlobalErrorHandlerService>;

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['isAuthenticated']);
    const globalSpy = jasmine.createSpyObj('GlobalService', ['roleBasedNavigation']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const globalErrorHandlerMock = jasmine.createSpyObj('GlobalErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: GlobalService, useValue: globalSpy },
        { provide: Router, useValue: routerMock },
        { provide: GlobalErrorHandlerService, useValue: globalErrorHandlerMock },
      ],
    });

    localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    globalServiceSpy = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    globalErrorHandlerSpy = TestBed.inject(GlobalErrorHandlerService) as jasmine.SpyObj<GlobalErrorHandlerService>;
  });

  it('should allow access if user is not authenticated', () => {
    localStorageServiceSpy.isAuthenticated.and.returnValue(false);

    const canActivate = TestBed.runInInjectionContext(() => publicGuard({} as any, {} as any));

    expect(canActivate).toBeTrue();
    expect(globalServiceSpy.roleBasedNavigation).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and navigate if user is authenticated', () => {
    localStorageServiceSpy.isAuthenticated.and.returnValue(true);

    const canActivate = TestBed.runInInjectionContext(() => publicGuard({} as any, {} as any));

    expect(canActivate).toBeFalse();
    expect(globalServiceSpy.roleBasedNavigation).toHaveBeenCalledWith(routerSpy);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should handle errors thrown in the guard and invoke global error handler', () => {
    localStorageServiceSpy.isAuthenticated.and.throwError('Test error');

    const canActivate = TestBed.runInInjectionContext(() => publicGuard({} as any, {} as any));

    expect(canActivate).toBeFalse();
    expect(globalErrorHandlerSpy.handleError).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('should handle exceptions in roleBasedNavigation and still deny access', () => {
    localStorageServiceSpy.isAuthenticated.and.returnValue(true);
    globalServiceSpy.roleBasedNavigation.and.throwError('Test navigation error');

    const canActivate = TestBed.runInInjectionContext(() => publicGuard({} as any, {} as any));

    expect(canActivate).toBeFalse();
    expect(globalErrorHandlerSpy.handleError).toHaveBeenCalledWith(jasmine.any(Error));
  });
});
