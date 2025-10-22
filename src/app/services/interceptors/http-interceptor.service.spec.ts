import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterceptorService } from './http-interceptor.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

describe('HttpInterceptorService', () => {
  let service: HttpClient;
  let httpMock: HttpTestingController;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'getLoggedInUserData',
      'isSsoLogin',
    ]);

    TestBed.configureTestingModule({
    imports: [],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true,
        },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});

    service = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const interceptor: HttpInterceptorService = TestBed.inject(
      HttpInterceptorService
    );
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header if token is present', () => {
    const mockToken = 'test-token';
    localStorageService.getLoggedInUserData.and.returnValue({
      token: mockToken,
    });

    service.get('/test').subscribe();

    const httpRequest = httpMock.expectOne('/test');
    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
  });

  it('should handle errors properly', () => {
    localStorageService.getLoggedInUserData.and.returnValue(null);

    service.get('/test').subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error: HttpErrorResponse) => {
        
        expect(error.message).toContain('500 Server Error'); 
      },
    });

    const httpRequest = httpMock.expectOne('/test');
    httpRequest.flush('Something went wrong', {
      status: 500,
      statusText: 'Server Error',
    });
  });

});