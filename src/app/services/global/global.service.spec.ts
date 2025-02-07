import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationURLs } from '../../../utils/application-constants';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { RoleService } from '../role/role.service';
import { GlobalService } from './global.service';

describe('GlobalService', () => {
  let service: GlobalService;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let roleService: jasmine.SpyObj<RoleService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'setRoleModuleMapping',
      'getRoleModuleMapping',
    ]);

    const roleServiceSpy = jasmine.createSpyObj('RoleService', [
      'getModulesMappedToLoggedinUser',
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        GlobalService,
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: RoleService, useValue: roleServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(GlobalService);
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit reload event when reloadComponent is called', (done: DoneFn) => {
    service.getReloadObservable().subscribe(() => {
      done();
    });
    service.reloadComponent();
  });

  it('should navigate to the HOME_CLIENTS URL on roleBasedNavigation', () => {
    service.roleBasedNavigation(router);
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.HOME_CLIENTS]);
  });

  it('should call router.navigate with the correct URL', () => {
    const url = '/test-url';
    service.navigate(url, router);
    expect(router.navigate).toHaveBeenCalledWith([url]);
  });

  it('should fetch role data and set role module mapping', () => {
    const mockRoleData = [{ moduleName: 'TestModule', testAction: true }];
    roleService.getModulesMappedToLoggedinUser.and.returnValue(
      of({ data: mockRoleData })
    );
    localStorageService.setRoleModuleMapping.and.stub();

    service.getRoleModuleMappingData().subscribe((result) => {
      expect(result).toBeTrue();
      expect(localStorageService.setRoleModuleMapping).toHaveBeenCalledWith(
        mockRoleData
      );
    });
  });

  it('should return false for inaccessible module/action', () => {
    localStorageService.getRoleModuleMapping.and.returnValue([]);
    const module = 'Customer';
    const action = 'Add';

    expect(service.isAccessible(module, action)).toBeFalse();
  });

  it('should return true for accessible module/action', () => {
    const mockRoleData = [
      {
        'roleModuleMappingId': 0,
        'moduleId': 2,
        'view': true,
        'add': false,
        'edit': false,
        'delete': false,
        'download': false,
        'upload': false,
        'moduleName': 'Auth',
        'description': null,
        'createdBy': null,
        'updatedBy': null,
        'createdOn': null,
        'updatedOn': null
      }
    ];

    localStorageService.getRoleModuleMapping.and.returnValue(mockRoleData);
    const module = 'Auth';
    const action = 'View';

    expect(service.isAccessible(module, action)).toBeTrue();
  });

  it('should handle error in getRolePageMappingData and return false', () => {
    roleService.getModulesMappedToLoggedinUser.and.returnValue(
      of({ data: null }).pipe(catchError(() => of(false)))
    );

    service.getRoleModuleMappingData().subscribe((result) => {
      expect(result).toBeFalse();
    });
  });

  it('should emit module name when triggerGridReload is called', (done: DoneFn) => {
    const moduleName = 'Customers';
    
    service.reloadGrid$.subscribe((emittedModuleName) => {
      expect(emittedModuleName).toBe(moduleName);
      done();
    });
  
    service.triggerGridReload(moduleName);
  });

  it('should emit module name when triggerApplyFilter is called', (done: DoneFn) => {
    const moduleName = 'Customers';
    
    service.refreshList$.subscribe((emittedModuleName) => {
      expect(emittedModuleName).toBe(moduleName);
      done();
    });
  
    service.triggerApplyFilter(moduleName);
  });

  it('should handle error and return false in getRolePageMappingData', () => {
    const mockError = new Error('Test error');
  
    // Simulate an error being thrown from the roleService observable
    roleService.getModulesMappedToLoggedinUser.and.returnValue(throwError(mockError));
  
    spyOn(console, 'error'); // Spy on console.error
  
    service.getRoleModuleMappingData().subscribe((result) => {
      expect(result).toBeFalse(); // Expect the result to be false due to the error
      expect(console.error).toHaveBeenCalledWith('Error fetching role data', mockError.message); // Expect the error to be logged
    });
  });
});
