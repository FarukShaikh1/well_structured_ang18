// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { of, throwError } from 'rxjs';
// import { GlobalService } from '../../services/global/global.service';
// import { LoaderService } from '../../services/loader/loader.service';
// import { RoleService } from '../../services/role/role.service';
// import { RoleMockDataService } from '../../test-helpers/role-mock-data.service';
// import { UserPermissionMockDataService } from '../../test-helpers/user-permission-mock-data.service';
// import { ActionConstant, ApplicationModules } from '../../utils/application-constants';
// import { UserPermissionComponent } from './user-permission.component';

// describe('UserPermissionComponent', () => {
//   let component: UserPermissionComponent;
//   let fixture: ComponentFixture<UserPermissionComponent>;
//   let mockRoleService: jasmine.SpyObj<RoleService>;
//   let mockLoaderService: jasmine.SpyObj<LoaderService>;
//   let mockGlobalService: jasmine.SpyObj<GlobalService>;

//   beforeEach(async () => {
//     // Mock services
//     mockRoleService = jasmine.createSpyObj('RoleService', ['getAllRoles', 'getUserPermissionByRoleId', 'updateUserPermission']);
//     mockLoaderService = jasmine.createSpyObj('LoaderService', ['showLoader', 'hideLoader']);
//     mockGlobalService = jasmine.createSpyObj('GlobalService', ['isAccessible']);

//     await TestBed.configureTestingModule({
//     imports: [UserPermissionComponent],
//     providers: [
//         { provide: RoleService, useValue: mockRoleService },
//         { provide: LoaderService, useValue: mockLoaderService },
//         { provide: GlobalService, useValue: mockGlobalService },
//         provideHttpClient(withInterceptorsFromDi()),
//     ]
// }).compileComponents();

//     fixture = TestBed.createComponent(UserPermissionComponent);
//     component = fixture.componentInstance;

//     // Add a mock ToasterComponent
//     component.toaster = jasmine.createSpyObj('ToasterComponent', ['showMessage']);
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('ngOnInit(): should load roles and initialize selectedRoleId on init', () => {
//     spyOn(component, 'getRoleList');
//     component.ngOnInit();

//     expect(component.getRoleList).toHaveBeenCalled();
//   });

//   describe('getRoleList', () => {
//     it('should fetch role list from by callin api with success response', () => {
//       const mockRoles = RoleMockDataService.getAllRoles();
//       mockRoleService.getAllRoles.and.returnValue(of({ data: mockRoles }));
//       spyOn(component, 'getUserPermissionByRoleId');

//       component.getRoleList();

//       expect(component.roleList.length).toBe(mockRoles.length);
//       expect(component.selectedRoleId).toEqual(mockRoles[0].id);
//       expect(component.getUserPermissionByRoleId).toHaveBeenCalledWith(mockRoles[0].id);
//     });

//     it('should handle error when fetching roles by calling api', () => {
//       const errorResponse = { message: 'Error fetching roles' };
//       mockRoleService.getAllRoles.and.returnValue(throwError(errorResponse));

//       console.error = spyOn(console, 'error');

//       component.getRoleList();

//       expect(console.error).toHaveBeenCalledWith(
//         'Error fetching roles',
//         errorResponse
//       );
//       expect(component.toaster.showMessage).toHaveBeenCalledWith(errorResponse.message, 'error');
//       expect(mockLoaderService.hideLoader).toHaveBeenCalled();
//     });
//   });

//   describe('getUserPermissionByRoleId', () => {
//     it('should load role module mapping for selected role', () => {
//       const roleId = '8d43d229-3baf-4649-b111-a6e6d42e16ab';
//       const mockRoleMappings = UserPermissionMockDataService.getRoleModuleMpappingByRoleId(roleId);
//       mockRoleService.getUserPermissionByRoleId.and.returnValue(of({ data: mockRoleMappings }));

//       component.getUserPermissionByRoleId(roleId);

//       expect(mockLoaderService.showLoader).toHaveBeenCalled();
//       expect(mockLoaderService.hideLoader).toHaveBeenCalled();
//     });

//     it('should handle error when fetching role module mappings', () => {
//       const errorResponse = { message: 'Error fetching role module mappings' };
//       mockRoleService.getUserPermissionByRoleId.and.returnValue(throwError(errorResponse));

//       component.getUserPermissionByRoleId('8d43d229-3baf-4649-b111-a6e6d42e16ab');

//       expect(mockLoaderService.showLoader).toHaveBeenCalled();
//       expect(component.toaster.showMessage).toHaveBeenCalledWith(errorResponse.message, 'error');
//       expect(mockLoaderService.hideLoader).toHaveBeenCalled();
//     });

//   });

//   describe('changeRole', () => {
//     const roleId = '8d43d229-3baf-4649-b111-a6e6d42e16ab';
//     it('should update selectedRoleId when changeRole is called', () => {
//       spyOn(component, 'getUserPermissionByRoleId');
//       const mockEvent = {
//         target: {
//           value: roleId
//         }
//       } as unknown as Event;

//       component.changeRole(mockEvent);

//       expect(component.selectedRoleId).toBe(roleId);
//       expect(component.getUserPermissionByRoleId).toHaveBeenCalledOnceWith(roleId);
//     });
//   });

//   describe('updateRoleModulePermission', () => {
//     it('should update role module permissions successfully', () => {
//       mockRoleService.updateUserPermission.and.returnValue(of({}));

//       component.updateRoleModulePermission();

//       expect(mockRoleService.updateUserPermission).toHaveBeenCalled();
//       expect(component.toaster.showMessage).toHaveBeenCalledWith('user-permission updated successfully', 'success');
//     });

//     it('should handle error during role module permission update', () => {
//       const errorResponse = { message: 'Update failed' };
//       mockRoleService.updateUserPermission.and.returnValue(throwError(errorResponse));

//       component.updateRoleModulePermission();

//       expect(mockRoleService.updateUserPermission).toHaveBeenCalled();
//       expect(component.toaster.showMessage).toHaveBeenCalledWith('Failed to update.', 'error');
//     });

//   });

//   it('isMappingEditable(): should check if mapping is editable', () => {
//     mockGlobalService.isAccessible.and.returnValue(true);
//     const isEditable = component.isMappingEditable();
//     expect(isEditable).toBeTrue();
//     expect(mockGlobalService.isAccessible).toHaveBeenCalledWith(ApplicationModules.ROLE_MODULE_MAPPING, ActionConstant.EDIT);
//   });

// });
