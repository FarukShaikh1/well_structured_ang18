import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { SsoInitializationService } from '../../../services/sso-initialization/sso-initialization.service';
import { NavigationURLs } from '../../../utils/application-constants';
import { UnauthorisedErrorComponent } from './unauthorised-error.component';

describe('UnauthorisedErrorComponent', () => {
  let component: UnauthorisedErrorComponent;
  let fixture: ComponentFixture<UnauthorisedErrorComponent>;
  let mockRouter: any;
  let mockLocalStorageService: any;
  let mockSsoInitializationService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['isSsoLogin', 'clear']);
    mockSsoInitializationService = jasmine.createSpyObj('SsoInitializationService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [UnauthorisedErrorComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: SsoInitializationService, useValue: mockSsoInitializationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorisedErrorComponent);
    component = fixture.componentInstance;
  });

  it('should clear local storage and call SSO logout if isSsoLogin returns true', () => {
    
    mockLocalStorageService.isSsoLogin.and.returnValue(true);

    
    component.backToLogin();

    
    expect(mockLocalStorageService.clear).toHaveBeenCalled();
    expect(mockSsoInitializationService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to logout page if isSsoLogin returns false', () => {
    
    mockLocalStorageService.isSsoLogin.and.returnValue(false);

    
    component.backToLogin();

    
    expect(mockRouter.navigate).toHaveBeenCalledWith([NavigationURLs.LOGOUT]);
    expect(mockLocalStorageService.clear).not.toHaveBeenCalled();
    expect(mockSsoInitializationService.logout).not.toHaveBeenCalled();
  });
});
