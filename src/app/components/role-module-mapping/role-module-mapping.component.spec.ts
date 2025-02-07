// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { of, throwError } from 'rxjs';
// import { GlobalService } from '../../services/global/global.service';
// import { LoaderService } from '../../services/loader/loader.service';
// import { RoleService } from '../../services/role/role.service';
// import { RoleMockDataService } from '../../test-helpers/role-mock-data.service';
// import { RoleModuleMappingMockDataService } from '../../test-helpers/role-module-mapping-mock-data.service';
// import { ApplicationModuleActions, ApplicationModules } from '../../utils/application-constants';
// import { RoleModuleMappingComponent } from './role-module-mapping.component';

// describe('RoleModuleMappingComponent', () => {
//   let component: RoleModuleMappingComponent;
//   let fixture: ComponentFixture<RoleModuleMappingComponent>;
//   let mockRoleService: jasmine.SpyObj<RoleService>;
//   let mockLoaderService: jasmine.SpyObj<LoaderService>;
//   let mockGlobalService: jasmine.SpyObj<GlobalService>;

//   beforeEach(async () => {
//     // Mock services
//     mockRoleService = jasmine.createSpyObj('RoleService', ['getAllRoles', 'getRoleModuleMappingByRoleId', 'updateRoleModuleMapping']);
//     mockLoaderService = jasmine.createSpyObj('LoaderService', ['showLoader', 'hideLoader']);
//     mockGlobalService = jasmine.createSpyObj('GlobalService', ['isAccessible']);

//     await TestBed.configureTestingModule({
//     imports: [RoleModuleMappingComponent],
//     providers: [
//         { provide: RoleService, useValue: mockRoleService },
//         { provide: LoaderService, useValue: mockLoaderService },
//         { provide: GlobalService, useValue: mockGlobalService },
//         provideHttpClient(withInterceptorsFromDi()),
//     ]
// }).compileComponents();

//     fixture = TestBed.createComponent(RoleModuleMappingComponent);
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
//       spyOn(component, 'getRoleModuleMappingByRoleId');

//       component.getRoleList();

//       expect(component.roleList.length).toBe(mockRoles.length);
//       expect(component.selectedRoleId).toEqual(mockRoles[0].id);
//       expect(component.getRoleModuleMappingByRoleId).toHaveBeenCalledWith(mockRoles[0].id);
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

//   describe('getRoleModuleMappingByRoleId', () => {
//     it('should load role module mapping for selected role', () => {
//       const roleId = '8d43d229-3baf-4649-b111-a6e6d42e16ab';
//       const mockRoleMappings = RoleModuleMappingMockDataService.getRoleModuleMpappingByRoleId(roleId);
//       mockRoleService.getRoleModuleMappingByRoleId.and.returnValue(of({ data: mockRoleMappings }));

//       component.getRoleModuleMappingByRoleId(roleId);

//       expect(mockLoaderService.showLoader).toHaveBeenCalled();
//       expect(mockLoaderService.hideLoader).toHaveBeenCalled();
//     });

//     it('should handle error when fetching role module mappings', () => {
//       const errorResponse = { message: 'Error fetching role module mappings' };
//       mockRoleService.getRoleModuleMappingByRoleId.and.returnValue(throwError(errorResponse));

//       component.getRoleModuleMappingByRoleId('8d43d229-3baf-4649-b111-a6e6d42e16ab');

//       expect(mockLoaderService.showLoader).toHaveBeenCalled();
//       expect(component.toaster.showMessage).toHaveBeenCalledWith(errorResponse.message, 'error');
//       expect(mockLoaderService.hideLoader).toHaveBeenCalled();
//     });

//   });

//   describe('changeRole', () => {
//     const roleId = '8d43d229-3baf-4649-b111-a6e6d42e16ab';
//     it('should update selectedRoleId when changeRole is called', () => {
//       spyOn(component, 'getRoleModuleMappingByRoleId');
//       const mockEvent = {
//         target: {
//           value: roleId
//         }
//       } as unknown as Event;

//       component.changeRole(mockEvent);

//       expect(component.selectedRoleId).toBe(roleId);
//       expect(component.getRoleModuleMappingByRoleId).toHaveBeenCalledOnceWith(roleId);
//     });
//   });

//   describe('updateRoleModulePermission', () => {
//     it('should update role module permissions successfully', () => {
//       mockRoleService.updateRoleModuleMapping.and.returnValue(of({}));

//       component.updateRoleModulePermission();

//       expect(mockRoleService.updateRoleModuleMapping).toHaveBeenCalled();
//       expect(component.toaster.showMessage).toHaveBeenCalledWith('Role-Module-Mapping updated successfully', 'success');
//     });

//     it('should handle error during role module permission update', () => {
//       const errorResponse = { message: 'Update failed' };
//       mockRoleService.updateRoleModuleMapping.and.returnValue(throwError(errorResponse));

//       component.updateRoleModulePermission();

//       expect(mockRoleService.updateRoleModuleMapping).toHaveBeenCalled();
//       expect(component.toaster.showMessage).toHaveBeenCalledWith('Failed to update.', 'error');
//     });

//   });

//   it('isMappingEditable(): should check if mapping is editable', () => {
//     mockGlobalService.isAccessible.and.returnValue(true);
//     const isEditable = component.isMappingEditable();
//     expect(isEditable).toBeTrue();
//     expect(mockGlobalService.isAccessible).toHaveBeenCalledWith(ApplicationModules.ROLE_MODULE_MAPPING, ApplicationModuleActions.EDIT);
//   });

// });
