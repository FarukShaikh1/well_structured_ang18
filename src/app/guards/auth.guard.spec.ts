import { TestBed } from '@angular/core/testing';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { GlobalService } from '../../services/global/global.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { NavigationURLs } from '../../utils/application-constants';

describe('authGuard', () => {
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;

  
  const executeGuard = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => TestBed.runInInjectionContext(() => authGuard(route, state));

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'isAuthenticated',
      'setUserAuthorized',
    ]);
    const globalSpy = jasmine.createSpyObj('GlobalService', [
      'getRolePageMappingData',
      'reloadComponent',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: GlobalService, useValue: globalSpy },
        { provide: Router, useValue: routerMock },
      ],
    });

    localStorageServiceSpy = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
    globalServiceSpy = TestBed.inject(
      GlobalService
    ) as jasmine.SpyObj<GlobalService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access if the user is authenticated and authorized', async () => {
    localStorageServiceSpy.isAuthenticated.and.returnValue(true);
    globalServiceSpy.getUserPermissionData.and.returnValue(of(true));

    const canActivate = await executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeTrue();
    expect(localStorageServiceSpy.setUserAuthorized).toHaveBeenCalledWith(true);
    expect(globalServiceSpy.reloadComponent).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and navigate to unauthorized page if user is authenticated but not authorized', async () => {
    localStorageServiceSpy.isAuthenticated.and.returnValue(true);
    globalServiceSpy.getUserPermissionData.and.returnValue(of(false));

    const canActivate = await executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeFalse();
    expect(localStorageServiceSpy.setUserAuthorized).toHaveBeenCalledWith(
      false
    );
    expect(globalServiceSpy.reloadComponent).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      NavigationURLs.UNAUTHORIZED_PAGE,
    ]);
  });

  it('should deny access if the user is not authenticated', async () => {
    localStorageServiceSpy.isAuthenticated.and.returnValue(false);

    const canActivate = await executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeFalse();
    expect(localStorageServiceSpy.setUserAuthorized).not.toHaveBeenCalled();
    expect(globalServiceSpy.reloadComponent).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should handle errors and navigate to unauthorized page', async () => {
    localStorageServiceSpy.isAuthenticated.and.returnValue(true);
    globalServiceSpy.getUserPermissionData.and.returnValue(of(false));
    globalServiceSpy.getUserPermissionData.and.throwError('Test Error');

    const canActivate = await executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      NavigationURLs.UNAUTHORIZED_PAGE,
    ]);
  });
});
