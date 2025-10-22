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
    
    component.ngOnInit();

    
    expect(loaderService.hideLoader).toHaveBeenCalled();
    expect(signalRService.getUnreadChatCountForNotification).toHaveBeenCalled();
  });

  it('clientList(): should call router.navigate with CLIENT_LIST URL on clientList', () => {
    
    component.clientList();

    
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.CLIENT_LIST]);
  });

  it('userList(): should call router.navigate with USER_LIST URL on userList', () => {
    
    component.userList();

    
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.USER_LIST]);
  });

  it('userPermissions(): should call router.navigate with ROLE_MODULE_MAPPING URL on user-permission list', () => {
    
    component.userPermissions();

    
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.ROLE_MODULE_MAPPING]);
  });

  it('goToPrograms(): should call router.navigate with PROGRAMS URL on programs list', () => {
    
    component.goToPrograms();

    
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.PROGRAMS]);
  });

  it('chatSystem(): should call router.navigate with chatSystem URL on chat list', () => {
    
    component.chatSystem();

    
    expect(router.navigate).toHaveBeenCalledWith([NavigationURLs.NAV_CHAT_PANEL]);
  });

  it('should set currentModuleName to "Home" and toggle displayFeedbackButton on FeedbackBtnClicked', () => {
    
    component.displayFeedbackButton = true;

    
    component.FeedbackBtnClicked();

    
    expect(component.currentModuleName).toBe('Home');
    expect(component.displayFeedbackButton).toBe(false); 

    
    component.FeedbackBtnClicked();

    
    expect(component.displayFeedbackButton).toBe(true); 
  });

  it('should set displayFeedback to false on closeFeedback', () => {
    
    component.displayFeedback = true;

    
    component.closeFeedback();

    
    expect(component.displayFeedback).toBe(false);
  });

  it('should log message on ngOnDestroy', () => {
    
    component.ngOnDestroy();

    
    expect(consoleLogSpy).toHaveBeenCalledWith('Home Page Destroyed');
  });

});