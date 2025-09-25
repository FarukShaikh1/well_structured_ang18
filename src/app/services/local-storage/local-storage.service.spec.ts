import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    
    localStorage.clear();
  });

  afterEach(() => {
    
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear localStorage', () => {
    localStorage.setItem('test', 'value');
    service.clear();
    expect(localStorage.getItem('test')).toBeNull();
  });

  it('should set and get current user', () => {
    const user = { token: '123', userName: 'testuser' };
    service.setLoggedInUserData(user, true, true);
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(user));
    expect(localStorage.getItem('isUserLoggedIn')).toEqual('true');
    expect(localStorage.getItem('isSsoLogin')).toEqual('true');
    expect(service.getLoggedInUserData()).toEqual(user);
  });

  it('should return true if user is authenticated', () => {
    const user = { token: '123', userName: 'testuser' };
    service.setLoggedInUserData(user, true, true);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if user is not authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should set and get role module mapping', () => {
    const mapping = [{ module: 'test' }];
    service.setUserPermission(mapping);
    expect(service.getUserPermission()).toEqual(mapping);
  });

  it('should set and get logged in user role ID', () => {
    const roleId = 'role123';
    service.setLoggedInUserRoleId(roleId);
    expect(service.getLoggedInUserRoleId()).toEqual(roleId);
  });

  it('should set and get user authorization status', () => {
    service.setUserAuthorized(true);
    expect(service.isUserAuthorized()).toBeTrue();
  });

  it('should return false if user is not authorized', () => {
    expect(service.isUserAuthorized()).toBeFalse();
  });

  it('should return false if not an SSO login', () => {
    expect(service.isSsoLogin()).toBeFalse();
  });

  it('should return true if it is an SSO login', () => {
    service.setLoggedInUserData({ token: '123', userName: 'testuser' }, true, true);
    expect(service.isSsoLogin()).toBeTrue();
  });
});
