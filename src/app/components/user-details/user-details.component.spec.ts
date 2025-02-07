// import {
//   provideHttpClient,
//   withInterceptorsFromDi,
// } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import {
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { GlobalService } from '../../services/global/global.service';
// import { LoaderService } from '../../services/loader/loader.service';
// import { RoleService } from '../../services/role/role.service';
// import { UserService } from '../../services/user/user.service';
// import { UserDetailsComponent } from './user-details.component';
// import { of, throwError } from 'rxjs';
// import { RoleMockDataService } from '../../test-helpers/role-mock-data.service';
// import { Messages } from '../../utils/application-constants';
// import { UserMockDataService } from '../../test-helpers/user-mock-data.service';
// import { ToasterComponent } from '../shared/toaster/toaster.component';
// import { PopupStats } from '../../interfaces/popup-stats';

// describe('UserDetailsComponent', () => {
//   let component: UserDetailsComponent;
//   let fixture: ComponentFixture<UserDetailsComponent>;
//   let roleServiceMock: jasmine.SpyObj<RoleService>;
//   let userServiceMock: jasmine.SpyObj<UserService>;
//   let loaderService: LoaderService;

//   beforeEach(async () => {
//     roleServiceMock = jasmine.createSpyObj<RoleService>('RoleService', [
//       'getAllRoles',
//     ]);
//     userServiceMock = jasmine.createSpyObj<UserService>('UserService', [
//       'getUsersById',
//       'addUser',
//       'updateUser',
//     ]);

//     await TestBed.configureTestingModule({
//       imports: [UserDetailsComponent, ReactiveFormsModule, ToasterComponent],
//       providers: [
//         { provide: UserService, useValue: userServiceMock },
//         { provide: RoleService, useValue: roleServiceMock },
//         GlobalService,
//         LoaderService,
//         provideHttpClient(withInterceptorsFromDi()),
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(UserDetailsComponent);
//     component = fixture.componentInstance;

//     const toasterFixture = TestBed.createComponent(ToasterComponent);
//     component.toaster = toasterFixture.componentInstance;
//     loaderService = TestBed.inject(LoaderService);
//     // fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('ngOnInit(): should call getRoleList on init', () => {
//     spyOn(component, 'getRoleList');
//     spyOn(component, 'initForm');
//     component.ngOnInit();
//     expect(component.getRoleList).toHaveBeenCalledTimes(1);
//     expect(component.initForm).toHaveBeenCalledTimes(1);
//   });

//   it('initForm(): should initialize the userForm with default values', () => {
//     component.initForm();
//     const userForm = component.userForm;

//     expect(userForm).toBeTruthy();
//     expect(userForm.controls['id']).toBeTruthy();
//     expect(userForm.controls['id'].value).toBe(0);

//     expect(userForm.controls['username']).toBeTruthy();
//     expect(userForm.controls['username'].value).toBe('');
//     expect(
//       userForm.controls['username'].hasValidator(Validators.required)
//     ).toBeTrue();

//     expect(userForm.controls['description']).toBeTruthy();
//     expect(userForm.controls['description'].value).toBe('');

//     expect(userForm.controls['email']).toBeTruthy();
//     expect(userForm.controls['email'].value).toBe('');

//     expect(userForm.controls['role']).toBeTruthy();
//     expect(userForm.controls['role'].value).toBe('');
//   });

//   it('getRoleList(): should call getAllRoles and set roleList', () => {
//     const mockData = RoleMockDataService.getAllRoles();
//     roleServiceMock.getAllRoles.and.returnValue(of({ data: mockData }));

//     component.getRoleList();

//     expect(roleServiceMock.getAllRoles).toHaveBeenCalledTimes(1);
//     expect(component.roleList).toEqual(mockData);
//   });

//   it('getRoleList(): should handle error when getAllRoles fails', () => {
//     const error = new Error(Messages.ERROR_IN_FETCHING_ROLES);
//     roleServiceMock.getAllRoles.and.returnValue(throwError(() => error));

//     console.error = spyOn(console, 'error');

//     component.getRoleList();

//     expect(roleServiceMock.getAllRoles).toHaveBeenCalledTimes(1);
//     expect(console.error).toHaveBeenCalledWith(
//       Messages.ERROR_IN_FETCHING_ROLES,
//       error
//     );
//   });

//   it('getUserDetails(): should call getUsersById of user service and set user details', () => {
//     const USER_ID = 'a7c00ca1-600d-461b-a931-5dcf93cfae22';
//     const mockData = UserMockDataService.getUserById(USER_ID);
//     userServiceMock.getUserDetailsById.and.returnValue(of({ data: mockData }));

//     component.userForm = new FormGroup({
//       id: new FormControl(''),
//       username: new FormControl(''),
//       email: new FormControl(''),
//       role: new FormControl(''),
//     });

//     component.getUserDetailsById(USER_ID);

//     expect(userServiceMock.getUserDetailsById).toHaveBeenCalledTimes(1);
//     expect(component.existingUserRole).toEqual(mockData.role);
//     expect(component.userForm.value).toEqual({
//       id: mockData.id,
//       username: mockData.userName,
//       email: mockData.email,
//       role: mockData.role,
//     });
//   });

//   it('getUserDetails(): should handle error when getUsersById fails', () => {
//     const USER_ID = 'a7c00ca1-600d-461b-a931-5dcf93cfae22';
//     const error = new Error('Error fetching user data');
//     userServiceMock.getUserDetailsById.and.returnValue(throwError(() => error));

//     console.error = spyOn(console, 'error');

//     component.getUserDetailsById(USER_ID);

//     expect(userServiceMock.getUserDetailsById).toHaveBeenCalledTimes(1);
//     expect(console.error).toHaveBeenCalledWith(
//       'Error fetching user data:',
//       error
//     );
//   });

//   it('resetForm(): should reset the user form and set isEditMode to false', () => {
//     component.userForm = new FormGroup({
//       id: new FormControl('a7c00ca1-600d-461b-a931-5dcf93cfae22'),
//       username: new FormControl('Test_user_name'),
//       email: new FormControl('testuser@test.com'),
//       role: new FormControl('Admin'),
//     });
//     component.isEditMode = true;

//     component.resetForm();

//     expect(component.userForm.value).toEqual({
//       id: null,
//       username: null,
//       email: null,
//       role: null,
//     });
//     expect(component.isEditMode).toBe(false);
//   });

//   //=======================
//   it('onSubmit(): should update user when in edit mode', () => {
//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
//     const spyToaster = spyOn(
//       component.toaster,
//       'showMessage'
//     ).and.callThrough();

//     component.isEditMode = true;
//     component.userForm = new FormGroup({
//       id: new FormControl('id'),
//       username: new FormControl('username'),
//       email: new FormControl('email@testemail.com'),
//       role: new FormControl('Admin'),
//     });
//     component.roleList = RoleMockDataService.getAllRoles();

//     userServiceMock.updateUser.and.returnValue(
//       of({ success: true, message: 'User updated successfully' })
//     );

//     component.onSubmit();

//     expect(userServiceMock.updateUser).toHaveBeenCalledTimes(1);
//     expect(userServiceMock.updateUser).toHaveBeenCalledWith({
//       id: 'id',
//       username: 'username',
//       email: 'email@testemail.com',
//       role: '8d43d229-3baf-4649-b111-a6e6d42e16ab', // matched role ID
//     });

//     expect(spyToaster).toHaveBeenCalledWith(
//       'User updated successfully',
//       'success'
//     );
//     expect(spyLoaderHide).toHaveBeenCalled();
//   });

//   it('onSubmit(): should handle error when updating user', () => {
//     const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
//     const spyToaster = spyOn(
//       component.toaster,
//       'showMessage'
//     ).and.callThrough();

//     component.isEditMode = true;
//     component.userForm = new FormGroup({
//       id: new FormControl('some-id'),
//       username: new FormControl('some-username'),
//       email: new FormControl('some-email'),
//       role: new FormControl('Admin'),
//     });
//     component.roleList = RoleMockDataService.getAllRoles();

//     const error = new Error('Error updating user');
//     userServiceMock.updateUser.and.returnValue(throwError(() => error));

//     component.onSubmit();

//     expect(spyLoaderShow).toHaveBeenCalled();
//     expect(spyToaster).toHaveBeenCalledWith('Error updating user', 'error');
//     expect(spyLoaderHide).toHaveBeenCalled();
//   });

//   it('onSubmit(): should add new user when not in edit mode', () => {
//     const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
//     const spyToaster = spyOn(
//       component.toaster,
//       'showMessage'
//     ).and.callThrough();

//     component.isEditMode = false;
//     component.userForm = new FormGroup({
//       username: new FormControl('TestUserName'),
//       email: new FormControl('test@test.com'),
//       role: new FormControl('8d43d229-3baf-4649-b111-a6e6d42e16ab'),
//     });
//     component.roleList = RoleMockDataService.getAllRoles();

//     userServiceMock.addUser.and.returnValue(
//       of({ success: true, message: 'User added successfully' })
//     );

//     component.onSubmit();

//     expect(spyLoaderShow).toHaveBeenCalled();
//     expect(userServiceMock.addUser).toHaveBeenCalledTimes(1);
//     expect(userServiceMock.addUser).toHaveBeenCalledWith({
//       username: 'TestUserName',
//       email: 'test@test.com',
//       role: '8d43d229-3baf-4649-b111-a6e6d42e16ab', // matched role ID
//     });
//     expect(spyToaster).toHaveBeenCalledWith(
//       'User added successfully',
//       'success'
//     );
//     expect(spyLoaderHide).toHaveBeenCalled();
//   });

//   it('onSubmit(): should handle error when adding new user', () => {
//     const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
//     const spyToaster = spyOn(
//       component.toaster,
//       'showMessage'
//     ).and.callThrough();

//     component.isEditMode = false;
//     component.userForm = new FormGroup({
//       username: new FormControl('new-username'),
//       email: new FormControl('new-email'),
//       role: new FormControl('Admin'),
//     });
//     component.roleList = RoleMockDataService.getAllRoles();

//     const error = new Error('Error adding user');
//     userServiceMock.addUser.and.returnValue(throwError(() => error));

//     component.onSubmit();

//     expect(spyLoaderShow).toHaveBeenCalled();
//     expect(spyToaster).toHaveBeenCalledWith('Error adding user', 'error');
//     expect(spyLoaderHide).toHaveBeenCalled();
//   });

//   //--------------------------------
//   it('openUserDetailsPopup(): should open popup and fetch user details when id is not 0', () => {
//     spyOn(component, 'getUserDetails');
//     component.openUserDetailsPopup('123', null);

//     expect(component.isEditMode).toBeTrue();
//     expect(component.getUserDetailsById).toHaveBeenCalledTimes(1);
//     expect(component.getUserDetailsById).toHaveBeenCalledWith('123');

//     const model = document.getElementById('userDetailsPopup');
//     if (model) {
//       expect(model.style.display).toBe('block');
//     } else {
//       expect(model).toBeNull();
//     }
//   });

//   it('openUserDetailsPopup(): should open popup and not fetch user details when id is 0', () => {
//     spyOn(component, 'getUserDetails');

//     const popupStats: PopupStats = {
//       isAddMode: false,
//       isEditMode: true,
//       popupTitle: 'Update Profile',
//       isEmailDisabled: true,
//       isUserNameDisabled: false,
//       isRoleDisabled: true,
//     };

//     component.openUserDetailsPopup('0', popupStats);

//     expect(component.isEditMode).toBeFalse();
//     expect(component.getUserDetailsById).not.toHaveBeenCalled();

//     const model = document.getElementById('userDetailsPopup');

//     if (model) {
//       expect(model.style.display).toBe('block');
//     } else {
//       expect(model).toBeNull();
//     }
//   });

//   it('openUserDetailsPopup(): should not open popup when model is null', () => {
//     spyOn(document, 'getElementById').and.returnValue(null);
//     spyOn(component, 'getUserDetails');

//     const popupStats: PopupStats = {
//       isAddMode: false,
//       isEditMode: true,
//       popupTitle: 'Update Profile',
//       isEmailDisabled: true,
//       isUserNameDisabled: false,
//       isRoleDisabled: true,
//     };

//     component.openUserDetailsPopup('123', popupStats);

//     expect(component.isEditMode).toBeTrue();
//     expect(component.getUserDetailsById).toHaveBeenCalledTimes(1);
//     expect(component.getUserDetailsById).toHaveBeenCalledWith('123');

//     expect(document.getElementById).toHaveBeenCalledTimes(1);
//     expect(document.getElementById).toHaveBeenCalledWith('userDetailsPopup');
//   });

//   it('openUserDetailsPopup(): should not open popup when model is null and popupStats is null', () => {
//     spyOn(document, 'getElementById').and.returnValue(null);
//     spyOn(component, 'getUserDetails');

//     component.openUserDetailsPopup('123', null);

//     expect(component.isEditMode).toBeTrue();
//     expect(component.getUserDetailsById).toHaveBeenCalledTimes(1);
//     expect(component.getUserDetailsById).toHaveBeenCalledWith('123');

//     expect(document.getElementById).toHaveBeenCalledTimes(1);
//     expect(document.getElementById).toHaveBeenCalledWith('userDetailsPopup');
//   });

//   it('closePopup(): should reset user role and form', () => {
//     component.existingUserRole = 'admin';
//     component.userForm = new FormGroup({
//       username: new FormControl('new-username'),
//       email: new FormControl('new-email'),
//       role: new FormControl('Admin'),
//     });

//     component.closePopup();

//     expect(component.existingUserRole).toBe('');
//     expect(component.userForm?.get('username')?.value).toBe(null);
//     expect(component.userForm?.get('email')?.value).toBe(null);
//     expect(component.userForm?.get('role')?.value).toBe(null);
//   });

//   it('closePopup(): should hide the popup', () => {
//     const model = document.getElementById('userDetailsPopup');
//     if (model) {
//       model.style.display = 'block'; // set up the popup to be visible

//       component.closePopup();

//       expect(model.style.display).toBe('none');
//     }
//   });

//   it('closePopup(): should not throw an error if model is null', () => {
//     spyOn(document, 'getElementById').and.returnValue(null);

//     component.closePopup();

//     expect(document.getElementById).toHaveBeenCalledTimes(1);
//     expect(document.getElementById).toHaveBeenCalledWith('userDetailsPopup');
//   });
// });
