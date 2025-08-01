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
// import { AccountService } from '../../services/account/account.service';
// import { AccountDetailsComponent } from './account-details.component';
// import { of, throwError } from 'rxjs';
// import { RoleMockDataService } from '../../test-helpers/role-mock-data.service';
// import { Messages } from '../../utils/application-constants';
// import { AccountMockDataService } from '../../test-helpers/account-mock-data.service';
// import { ToasterComponent } from '../shared/toaster/toaster.component';
// import { PopupStats } from '../../interfaces/popup-stats';

// describe('AccountDetailsComponent', () => {
//   let component: AccountDetailsComponent;
//   let fixture: ComponentFixture<AccountDetailsComponent>;
//   let roleServiceMock: jasmine.SpyObj<RoleService>;
//   let accountServiceMock: jasmine.SpyObj<AccountService>;
//   let loaderService: LoaderService;

//   beforeEach(async () => {
//     roleServiceMock = jasmine.createSpyObj<RoleService>('RoleService', [
//       'getAllRoles',
//     ]);
//     accountServiceMock = jasmine.createSpyObj<AccountService>('AccountService', [
//       'getAccountsById',
//       'addAccount',
//       'updateAccount',
//     ]);

//     await TestBed.configureTestingModule({
//       imports: [AccountDetailsComponent, ReactiveFormsModule, ToasterComponent],
//       providers: [
//         { provide: AccountService, useValue: accountServiceMock },
//         { provide: RoleService, useValue: roleServiceMock },
//         GlobalService,
//         LoaderService,
//         provideHttpClient(withInterceptorsFromDi()),
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(AccountDetailsComponent);
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

//   it('initForm(): should initialize the accountForm with default values', () => {
//     component.initForm();
//     const accountForm = component.accountForm;

//     expect(accountForm).toBeTruthy();
//     expect(accountForm.controls['id']).toBeTruthy();
//     expect(accountForm.controls['id'].value).toBe(0);

//     expect(accountForm.controls['accountName']).toBeTruthy();
//     expect(accountForm.controls['accountName'].value).toBe('');
//     expect(
//       accountForm.controls['accountName'].hasValidator(Validators.required)
//     ).toBeTrue();

//     expect(accountForm.controls['description']).toBeTruthy();
//     expect(accountForm.controls['description'].value).toBe('');

//     expect(accountForm.controls['email']).toBeTruthy();
//     expect(accountForm.controls['email'].value).toBe('');

//     expect(accountForm.controls['role']).toBeTruthy();
//     expect(accountForm.controls['role'].value).toBe('');
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

//   it('getAccountDetails(): should call getAccountsById of account service and set account details', () => {
//     const USER_ID = 'a7c00ca1-600d-461b-a931-5dcf93cfae22';
//     const mockData = AccountMockDataService.getAccountById(USER_ID);
//     accountServiceMock.getAccountDetailsById.and.returnValue(of({ data: mockData }));

//     component.accountForm = new FormGroup({
//       id: new FormControl(''),
//       accountName: new FormControl(''),
//       email: new FormControl(''),
//       role: new FormControl(''),
//     });

//     component.getAccountDetailsById(USER_ID);

//     expect(accountServiceMock.getAccountDetailsById).toHaveBeenCalledTimes(1);
//     expect(component.existingAccountRole).toEqual(mockData.role);
//     expect(component.accountForm.value).toEqual({
//       id: mockData.id,
//       accountName: mockData.accountName,
//       email: mockData.email,
//       role: mockData.role,
//     });
//   });

//   it('getAccountDetails(): should handle error when getAccountsById fails', () => {
//     const USER_ID = 'a7c00ca1-600d-461b-a931-5dcf93cfae22';
//     const error = new Error('Error fetching account data');
//     accountServiceMock.getAccountDetailsById.and.returnValue(throwError(() => error));

//     console.error = spyOn(console, 'error');

//     component.getAccountDetailsById(USER_ID);

//     expect(accountServiceMock.getAccountDetailsById).toHaveBeenCalledTimes(1);
//     expect(console.error).toHaveBeenCalledWith(
//       'Error fetching account data:',
//       error
//     );
//   });

//   it('resetForm(): should reset the account form and set isEditMode to false', () => {
//     component.accountForm = new FormGroup({
//       id: new FormControl('a7c00ca1-600d-461b-a931-5dcf93cfae22'),
//       accountName: new FormControl('Test_account_name'),
//       email: new FormControl('testaccount@test.com'),
//       role: new FormControl('Admin'),
//     });
//     component.isEditMode = true;

//     component.resetForm();

//     expect(component.accountForm.value).toEqual({
//       id: null,
//       accountName: null,
//       email: null,
//       role: null,
//     });
//     expect(component.isEditMode).toBe(false);
//   });

//   //=======================
//   it('onSubmit(): should update account when in edit mode', () => {
//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
//     const spyToaster = spyOn(
//       component.toaster,
//       'showMessage'
//     ).and.callThrough();

//     component.isEditMode = true;
//     component.accountForm = new FormGroup({
//       id: new FormControl('id'),
//       accountName: new FormControl('accountName'),
//       email: new FormControl('email@testemail.com'),
//       role: new FormControl('Admin'),
//     });
//     component.roleList = RoleMockDataService.getAllRoles();

//     accountServiceMock.updateAccount.and.returnValue(
//       of({ success: true, message: 'Account updated successfully' })
//     );

//     component.onSubmit();

//     expect(accountServiceMock.updateAccount).toHaveBeenCalledTimes(1);
//     expect(accountServiceMock.updateAccount).toHaveBeenCalledWith({
//       id: 'id',
//       accountName: 'accountName',
//       email: 'email@testemail.com',
//       role: '8d43d229-3baf-4649-b111-a6e6d42e16ab', // matched role ID
//     });

//     expect(spyToaster).toHaveBeenCalledWith(
//       'Account updated successfully',
//       'success'
//     );
//     expect(spyLoaderHide).toHaveBeenCalled();
//   });

//   it('onSubmit(): should handle error when updating account', () => {
//     const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
//     const spyToaster = spyOn(
//       component.toaster,
//       'showMessage'
//     ).and.callThrough();

//     component.isEditMode = true;
//     component.accountForm = new FormGroup({
//       id: new FormControl('some-id'),
//       accountName: new FormControl('some-accountName'),
//       email: new FormControl('some-email'),
//       role: new FormControl('Admin'),
//     });
//     component.roleList = RoleMockDataService.getAllRoles();

//     const error = new Error('Error updating account');
//     accountServiceMock.updateAccount.and.returnValue(throwError(() => error));

//     component.onSubmit();

//     expect(spyLoaderShow).toHaveBeenCalled();
//     expect(spyToaster).toHaveBeenCalledWith('Error updating account', 'error');
//     expect(spyLoaderHide).toHaveBeenCalled();
//   });

//   it('onSubmit(): should add new account when not in edit mode', () => {
//     const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
//     const spyToaster = spyOn(
//       component.toaster,
//       'showMessage'
//     ).and.callThrough();

//     component.isEditMode = false;
//     component.accountForm = new FormGroup({
//       accountName: new FormControl('TestAccountName'),
//       email: new FormControl('test@test.com'),
//       role: new FormControl('8d43d229-3baf-4649-b111-a6e6d42e16ab'),
//     });
//     component.roleList = RoleMockDataService.getAllRoles();

//     accountServiceMock.addAccount.and.returnValue(
//       of({ success: true, message: 'Account added successfully' })
//     );

//     component.onSubmit();

//     expect(spyLoaderShow).toHaveBeenCalled();
//     expect(accountServiceMock.addAccount).toHaveBeenCalledTimes(1);
//     expect(accountServiceMock.addAccount).toHaveBeenCalledWith({
//       accountName: 'TestAccountName',
//       email: 'test@test.com',
//       role: '8d43d229-3baf-4649-b111-a6e6d42e16ab', // matched role ID
//     });
//     expect(spyToaster).toHaveBeenCalledWith(
//       'Account added successfully',
//       'success'
//     );
//     expect(spyLoaderHide).toHaveBeenCalled();
//   });

//   it('onSubmit(): should handle error when adding new account', () => {
//     const spyLoaderShow = spyOn(loaderService, 'showLoader').and.callThrough();
//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
//     const spyToaster = spyOn(
//       component.toaster,
//       'showMessage'
//     ).and.callThrough();

//     component.isEditMode = false;
//     component.accountForm = new FormGroup({
//       accountName: new FormControl('new-accountName'),
//       email: new FormControl('new-email'),
//       role: new FormControl('Admin'),
//     });
//     component.roleList = RoleMockDataService.getAllRoles();

//     const error = new Error('Error adding account');
//     accountServiceMock.addAccount.and.returnValue(throwError(() => error));

//     component.onSubmit();

//     expect(spyLoaderShow).toHaveBeenCalled();
//     expect(spyToaster).toHaveBeenCalledWith('Error adding account', 'error');
//     expect(spyLoaderHide).toHaveBeenCalled();
//   });

//   //--------------------------------
//   it('openAccountDetailsPopup(): should open popup and fetch account details when id is not 0', () => {
//     spyOn(component, 'getAccountDetails');
//     component.openAccountDetailsPopup('123', null);

//     expect(component.isEditMode).toBeTrue();
//     expect(component.getAccountDetailsById).toHaveBeenCalledTimes(1);
//     expect(component.getAccountDetailsById).toHaveBeenCalledWith('123');

//     const model = document.getElementById('accountDetailsPopup');
//     if (model) {
//       expect(model.style.display).toBe('block');
//     } else {
//       expect(model).toBeNull();
//     }
//   });

//   it('openAccountDetailsPopup(): should open popup and not fetch account details when id is 0', () => {
//     spyOn(component, 'getAccountDetails');

//     const popupStats: PopupStats = {
//       isAddMode: false,
//       isEditMode: true,
//       popupTitle: 'Update Profile',
//       isEmailDisabled: true,
//       isAccountNameDisabled: false,
//       isRoleDisabled: true,
//     };

//     component.openAccountDetailsPopup('0', popupStats);

//     expect(component.isEditMode).toBeFalse();
//     expect(component.getAccountDetailsById).not.toHaveBeenCalled();

//     const model = document.getElementById('accountDetailsPopup');

//     if (model) {
//       expect(model.style.display).toBe('block');
//     } else {
//       expect(model).toBeNull();
//     }
//   });

//   it('openAccountDetailsPopup(): should not open popup when model is null', () => {
//     spyOn(document, 'getElementById').and.returnValue(null);
//     spyOn(component, 'getAccountDetails');

//     const popupStats: PopupStats = {
//       isAddMode: false,
//       isEditMode: true,
//       popupTitle: 'Update Profile',
//       isEmailDisabled: true,
//       isAccountNameDisabled: false,
//       isRoleDisabled: true,
//     };

//     component.openAccountDetailsPopup('123', popupStats);

//     expect(component.isEditMode).toBeTrue();
//     expect(component.getAccountDetailsById).toHaveBeenCalledTimes(1);
//     expect(component.getAccountDetailsById).toHaveBeenCalledWith('123');

//     expect(document.getElementById).toHaveBeenCalledTimes(1);
//     expect(document.getElementById).toHaveBeenCalledWith('accountDetailsPopup');
//   });

//   it('openAccountDetailsPopup(): should not open popup when model is null and popupStats is null', () => {
//     spyOn(document, 'getElementById').and.returnValue(null);
//     spyOn(component, 'getAccountDetails');

//     component.openAccountDetailsPopup('123', null);

//     expect(component.isEditMode).toBeTrue();
//     expect(component.getAccountDetailsById).toHaveBeenCalledTimes(1);
//     expect(component.getAccountDetailsById).toHaveBeenCalledWith('123');

//     expect(document.getElementById).toHaveBeenCalledTimes(1);
//     expect(document.getElementById).toHaveBeenCalledWith('accountDetailsPopup');
//   });

//   it('closePopup(): should reset account role and form', () => {
//     component.existingAccountRole = 'admin';
//     component.accountForm = new FormGroup({
//       accountName: new FormControl('new-accountName'),
//       email: new FormControl('new-email'),
//       role: new FormControl('Admin'),
//     });

//     component.closePopup();

//     expect(component.existingAccountRole).toBe('');
//     expect(component.accountForm?.get('accountName')?.value).toBe(null);
//     expect(component.accountForm?.get('email')?.value).toBe(null);
//     expect(component.accountForm?.get('role')?.value).toBe(null);
//   });

//   it('closePopup(): should hide the popup', () => {
//     const model = document.getElementById('accountDetailsPopup');
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
//     expect(document.getElementById).toHaveBeenCalledWith('accountDetailsPopup');
//   });
// });
