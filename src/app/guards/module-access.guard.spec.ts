import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { moduleAccessGuard } from './module-access.guard';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { NavigationURLs } from '../../utils/application-constants';
import { GlobalErrorHandlerService } from '../../services/error-handling/global-error-handler.service';

describe('moduleAccessGuard', () => {
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let globalErrorHandlerSpy: jasmine.SpyObj<GlobalErrorHandlerService>;

  const executeGuard = (route: ActivatedRouteSnapshot) =>
    TestBed.runInInjectionContext(() => moduleAccessGuard(route, {} as any));

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getRoleModuleMapping']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const globalErrorHandlerMock = jasmine.createSpyObj('GlobalErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: Router, useValue: routerMock },
        { provide: GlobalErrorHandlerService, useValue: globalErrorHandlerMock },
      ],
    });

    localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    globalErrorHandlerSpy = TestBed.inject(GlobalErrorHandlerService) as jasmine.SpyObj<GlobalErrorHandlerService>;
  });

  function createActivatedRouteSnapshot(data: any): ActivatedRouteSnapshot {
    return {
      data,
      params: {},
      queryParams: {},
      fragment: null,
      url: [],
      outlet: '',
      routeConfig: null,
      root: null,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: null,
      queryParamMap: null,
    } as unknown as ActivatedRouteSnapshot;
  }

  it('should allow access if the user has view permission for the module', () => {
    const userModulePermission = [
      { moduleName: 'userModulePermission', view: true },
    ];
    localStorageServiceSpy.getRoleModuleMapping.and.returnValue(userModulePermission);

    const route = createActivatedRouteSnapshot({ moduleName: 'userModulePermission' });

    const canActivate = executeGuard(route);

    expect(canActivate).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and navigate to error page if the user does not have view permission', () => {
    const userModulePermission = [
      { moduleName: 'userModulePermission', view: false },
    ];
    localStorageServiceSpy.getRoleModuleMapping.and.returnValue(userModulePermission);

    const route = createActivatedRouteSnapshot({ moduleName: 'userModulePermission' });

    const canActivate = executeGuard(route);

    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith([NavigationURLs.ERROR_PAGE]);
  });

  it('should deny access and navigate to error page if the module is not found in userModulePermission', () => {
    const userModulePermission = [
      { moduleName: 'Auth', view: true },
    ];
    localStorageServiceSpy.getRoleModuleMapping.and.returnValue(userModulePermission);

    const route = createActivatedRouteSnapshot({ moduleName: 'NonExistentModule' });

    const canActivate = executeGuard(route);

    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith([NavigationURLs.ERROR_PAGE]);
  });

  it('should deny access and navigate to error page if userModulePermission is empty', () => {
    localStorageServiceSpy.getRoleModuleMapping.and.returnValue([]);

    const route = createActivatedRouteSnapshot({ moduleName: 'userModulePermission' });

    const canActivate = executeGuard(route);

    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith([NavigationURLs.ERROR_PAGE]);
  });

  it('should call GlobalErrorHandlerService if an error occurs', () => {
    localStorageServiceSpy.getRoleModuleMapping.and.throwError('Error getting role mappings');

    const route = createActivatedRouteSnapshot({ moduleName: 'userModulePermission' });

    const canActivate = executeGuard(route);

    expect(canActivate).toBeFalse();
    expect(globalErrorHandlerSpy.handleError).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

});
