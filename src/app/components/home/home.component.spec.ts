import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader/loader.service';
import { SignalRService } from '../../services/signal-r/signal-r.service';
import { GlobalService } from '../../services/global/global.service';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { LoaderComponent } from '../shared/loader/loader.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NavigationURLs } from '../../../utils/application-constants';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let signalRService: jasmine.SpyObj<SignalRService>;
  let router: jasmine.SpyObj<Router>;
  let consoleLogSpy: jasmine.Spy;

  beforeEach(async () => {
    loaderService = jasmine.createSpyObj('LoaderService', ['hideLoader']);
    signalRService = jasmine.createSpyObj('SignalRService', ['getUnreadChatCountForNotification']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    consoleLogSpy = spyOn(console, 'log');

    await TestBed.configureTestingModule({
    imports: [CommonModule,
        RouterModule,
        ToasterComponent,
        LoaderComponent,
        FeedbackComponent],
    providers: [
        { provide: LoaderService, useValue: loaderService },
        { provide: SignalRService, useValue: signalRService },
        { provide: GlobalService, useValue: jasmine.createSpyObj('GlobalService', ['isAccessible']) },
        { provide: Router, useValue: router },
        provideHttpClient(withInterceptorsFromDi()),
    ]
}).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(): should call hideLoader and getUnreadChatCountForNotification on ngOnInit', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(loaderService.hideLoader).toHaveBeenCalled();
    expect(signalRService.getUnreadChatCountForNotification).toHaveBeenCalled();
  });

  it('customerList(): should call router.navigate with CUSTOMER_LIST URL on customerList', () => {
    // Act
    component.customerList();

    // Assert
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.CUSTOMER_LIST]);
  });

  it('userList(): should call router.navigate with USER_LIST URL on userList', () => {
    // Act
    component.userList();

    // Assert
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.USER_LIST]);
  });

  it('roleModuleMapping(): should call router.navigate with ROLE_MODULE_MAPPING URL on role-module-mapping list', () => {
    // Act
    component.roleModuleMapping();

    // Assert
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.ROLE_MODULE_MAPPING]);
  });

  it('goToPrograms(): should call router.navigate with PROGRAMS URL on programs list', () => {
    // Act
    component.goToPrograms();

    // Assert
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.PROGRAMS]);
  });

  it('chatSystem(): should call router.navigate with chatSystem URL on chat list', () => {
    // Act
    component.chatSystem();

    // Assert
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.NAV_CHAT_PANEL]);
  });

  it('should set currentModuleName to "Home" and toggle displayFeedbackButton on FeedbackBtnClicked', () => {
    // Initial state
    component.displayFeedbackButton = true;

    // Act
    component.FeedbackBtnClicked();

    // Assert
    expect(component.currentModuleName).toBe('Home');
    expect(component.displayFeedbackButton).toBe(false); // It should toggle to false

    // Act again to toggle back
    component.FeedbackBtnClicked();

    // Assert again
    expect(component.displayFeedbackButton).toBe(true); // It should toggle back to true
  });

  it('should set displayFeedback to false on closeFeedback', () => {
    // Initial state
    component.displayFeedback = true;

    // Act
    component.closeFeedback();

    // Assert
    expect(component.displayFeedback).toBe(false);
  });

  it('should log message on ngOnDestroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(consoleLogSpy).toHaveBeenCalledWith('Home Page Destroyed');
  });

});