import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NavigationURLs } from '../../../utils/application-constants';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService, private router: Router) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.localStorageService.getLoggedInUserData()?.token;

    const clonedRequest = request.clone({
      headers: request.headers
        .set('Authorization', token ? `Bearer ${token}` : '')
    });

    return next.handle(clonedRequest).pipe(
      map((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (!request.url.includes('/login') && !request.url.includes('/resetpassword') && !request.url.includes('userPermissions/getmodulemappedtologgedinuser')) {
          if (error?.status === 401) {
            
            this.router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
          }
        }
        console.error('Error Intercepted', error);
        
        
        return throwError(() => new Error(error.message));
      })
    );
  }
}
