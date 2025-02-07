// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HeaderComponent } from './header.component';
// // import { SsoInitializationService } from '../../services/sso-initialization/sso-initialization.service';
// import { MsalBroadcastService } from '@azure/msal-angular';
// import { SignalRService } from '../../../services/signal-r/signal-r.service';
// import { GlobalService } from '../../../services/global/global.service';
// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
// import { BehaviorSubject, of } from 'rxjs';
// import { Router } from '@angular/router';
// import { NavigationURLs } from '../../utils/application-constants';

// describe('HeaderComponent', () => {
//   let component: HeaderComponent;
//   let fixture: ComponentFixture<HeaderComponent>;
//   let globalServiceMock: jasmine.SpyObj<GlobalService>;
//   let ssoInitializationServiceMock: jasmine.SpyObj<SsoInitializationService>;
//   let msalBroadcastServiceMock: jasmine.SpyObj<MsalBroadcastService>;
//   let signalRServiceMock: jasmine.SpyObj<SignalRService>;
//   let localStorageServiceMock: jasmine.SpyObj<LocalStorageService>;

//   const unreadMessageCount = 5;

//   beforeEach(async () => {
//     globalServiceMock = jasmine.createSpyObj('GlobalService', ['getReloadObservable']);
//     globalServiceMock.getReloadObservable.and.returnValue(of(undefined));

//     ssoInitializationServiceMock = jasmine.createSpyObj('SsoInitializationService', ['initializeAuth', 'logout'], {
//       authService: {
//         instance: {
//           getAllAccounts: jasmine.createSpy('getAllAccounts').and.returnValue([])
//         }
//       }
//     });

//     msalBroadcastServiceMock = jasmine.createSpyObj('MsalBroadcastService', ['msalSubject$'], {
//       msalSubject$: of({})
//     });

//     signalRServiceMock = jasmine.createSpyObj('SignalRService', ['unreadMessageCount$', 'closeConnection'], {
//       unreadMessageCount$: of(unreadMessageCount)
//     });

//     localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['isAuthenticated', 'isUserAuthorized', 'clear', 'isSsoLogin', 'getLoggedInUserData']);

//     await TestBed.configureTestingModule({
//     schemas: [NO_ERRORS_SCHEMA],
//     imports: [HeaderComponent],
//     providers: [
//         { provide: SsoInitializationService, useValue: ssoInitializationServiceMock },
//         { provide: MsalBroadcastService, useValue: msalBroadcastServiceMock },
//         { provide: SignalRService, useValue: signalRServiceMock },
//         { provide: GlobalService, useValue: globalServiceMock },
//         { provide: LocalStorageService, useValue: localStorageServiceMock },
//         provideHttpClient(withInterceptorsFromDi())
//     ]
// }).compileComponents();

//     fixture = TestBed.createComponent(HeaderComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call setLoginDisplay on init', () => {
//     const setLoginDisplaySpy = spyOn(component, 'setLoginDisplay');
//     component.ngOnInit();
//     expect(setLoginDisplaySpy).toHaveBeenCalledTimes(1);
//   });

//   it('should subscribe to msalBroadcastService on init', () => {
//     const subscribeSpy = spyOn(msalBroadcastServiceMock.msalSubject$, 'subscribe');
//     component.ngOnInit();
//     expect(subscribeSpy).toHaveBeenCalledTimes(1);
//   });

//   it('should set alreadyLoggedIn on init', () => {
//     localStorageServiceMock.isAuthenticated.and.returnValue(true);
//     component.ngOnInit();
//     expect(component.alreadyLoggedIn).toBe(true);
//   });

//   it('should subscribe to signalRService on init', () => {
//     const subscribeSpy = spyOn(signalRServiceMock.unreadMessageCount$, 'subscribe');
//     component.ngOnInit();
//     expect(subscribeSpy).toHaveBeenCalledTimes(1);
//   });

//   it('should update notificationsCount on signalRService emit', () => {
//     signalRServiceMock.unreadMessageCount$ = new BehaviorSubject(5);
//     component.ngOnInit();
//     fixture.detectChanges();
//     expect(component.notificationsCount).toBe(unreadMessageCount);
//   });

//   it('should call appropriate services and methods on logout when SSO login is true', () => {
//     localStorageServiceMock.isSsoLogin.and.returnValue(true);

//     component.logout();

//     expect(localStorageServiceMock.clear).toHaveBeenCalled();
//     expect(component.notificationsCount).toBe(0);
//   });


//   it('should navigate to logout route when SSO login is false', () => {
//     localStorageServiceMock.isSsoLogin.and.returnValue(false);
//     const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

//     component.logout();

//     expect(navigateSpy).toHaveBeenCalledWith([NavigationURLs.LOGOUT]);
//     expect(component.notificationsCount).toBe(0);
//   });

//   it('should navigate to the user profile page on goToProfilePage', () => {
//     const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

//     component.goToProfilePage();

//     expect(navigateSpy).toHaveBeenCalledWith([NavigationURLs.USER_PROFILE]);
//   });

//   it('should return the logged-in username', () => {
//     const mockUserData = { username: 'testUser' };
//     localStorageServiceMock.getLoggedInUserData.and.returnValue(mockUserData);

//     const username = component.getLoggedInUserName();

//     expect(username).toBe(mockUserData.username);
//     expect(localStorageServiceMock.getLoggedInUserData).toHaveBeenCalled();
//   });

//   it('should navigate to the chat panel on redirectToChat', () => {
//     const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

//     component.redirectToChat();

//     expect(navigateSpy).toHaveBeenCalledWith([NavigationURLs.NAV_CHAT_PANEL]);
//   });

//   it('should return true if the user is authorized and logged in', () => {
//     localStorageServiceMock.isUserAuthorized.and.returnValue(true);
//     component.alreadyLoggedIn = true;

//     const showSettings = component.showSettingsIcon();

//     expect(showSettings).toBe(true);
//   });

//   it('should return false if the user is not authorized or not logged in', () => {
//     localStorageServiceMock.isUserAuthorized.and.returnValue(false);
//     component.alreadyLoggedIn = false;

//     const showSettings = component.showSettingsIcon();

//     expect(showSettings).toBe(false);
//   });

//   it('should call setLoginDisplay in ngOnInit', () => {
//     const setLoginDisplaySpy = spyOn(component, 'setLoginDisplay');
//     component.ngOnInit();
//     expect(setLoginDisplaySpy).toHaveBeenCalled();
//   });

//   describe('showNotificationIcon', () => {
//     it('should return true if alreadyLoggedIn is true and user is authorized', () => {
//       component.alreadyLoggedIn = true;
//       component.loginDisplay = false; // irrelevant in this case
//       localStorageServiceMock.isUserAuthorized.and.returnValue(true);
  
//       const result = component.showNotificationIcon();
  
//       expect(result).toBe(true);
//       expect(localStorageServiceMock.isUserAuthorized).toHaveBeenCalled();
//     });
  
//     it('should return true if loginDisplay is true and user is authorized', () => {
//       component.alreadyLoggedIn = false;
//       component.loginDisplay = true;
//       localStorageServiceMock.isUserAuthorized.and.returnValue(true);
  
//       const result = component.showNotificationIcon();
  
//       expect(result).toBe(true);
//       expect(localStorageServiceMock.isUserAuthorized).toHaveBeenCalled();
//     });
  
//     it('should return false if neither alreadyLoggedIn nor loginDisplay are true', () => {
//       component.alreadyLoggedIn = false;
//       component.loginDisplay = false;
//       localStorageServiceMock.isUserAuthorized.and.returnValue(true);
  
//       const result = component.showNotificationIcon();
  
//       expect(result).toBe(false);
//     });
  
//     it('should return false if user is not authorized', () => {
//       component.alreadyLoggedIn = true;
//       localStorageServiceMock.isUserAuthorized.and.returnValue(false);
  
//       const result = component.showNotificationIcon();
  
//       expect(result).toBe(false);
//       expect(localStorageServiceMock.isUserAuthorized).toHaveBeenCalled();
//     });
//   });

//   describe('showLogoutButton', () => {
//     it('should return true if alreadyLoggedIn is true', () => {
//       component.alreadyLoggedIn = true;
//       component.loginDisplay = false;
  
//       const result = component.showLogoutButton();
  
//       expect(result).toBe(true);
//     });
  
//     it('should return true if loginDisplay is true', () => {
//       component.alreadyLoggedIn = false;
//       component.loginDisplay = true;
  
//       const result = component.showLogoutButton();
  
//       expect(result).toBe(true);
//     });
  
//     it('should return false if both alreadyLoggedIn and loginDisplay are false', () => {
//       component.alreadyLoggedIn = false;
//       component.loginDisplay = false;
  
//       const result = component.showLogoutButton();
  
//       expect(result).toBe(false);
//     });
//   });

// });