import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RoleService } from './role.service';
import { HttpService } from '../rest/http.service';
import { API_URL } from '../../../utils/api-url';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [RoleService, HttpService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all roles', () => {
    const mockRoles = [{ id: 1, name: 'Admin' }];

    service.getAllRoles().subscribe((roles) => {
      expect(roles).toEqual(mockRoles);
    });

    const req = httpMock.expectOne(API_URL.GET_ALL_ROLES);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles);
  });

  it('should get modules mapped to logged in user', () => {
    const mockModules = { data: [{ module: 'Module1' }] };

    service.getModulesMappedToLoggedinUser().subscribe((modules) => {
      expect(modules).toEqual(mockModules);
    });

    const req = httpMock.expectOne(API_URL.GET_MODULE_MAPPED_TO_LOGGEDIN_USER);
    expect(req.request.method).toBe('GET');
    req.flush(mockModules);
  });

  it('should get role module mapping by role id', () => {
    const roleId = '123';
    const mockMapping = { modules: ['Module1'] };

    service.getRoleModuleMappingByRoleId(roleId).subscribe((mapping) => {
      expect(mapping).toEqual(mockMapping);
    });

    const req = httpMock.expectOne(
      `${API_URL.GET_ROLE_MODULE_MAPPING_BY_ROLE_ID}${roleId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockMapping);
  });

  it('should update role page mapping', () => {
    const mockResponse = { success: true };
    const updateData = { roleId: '123', mapping: ['Module1'] };

    service.updateRoleModuleMapping(updateData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(API_URL.UPDATE_ROLE_MODULE_MAPPING);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });
});
