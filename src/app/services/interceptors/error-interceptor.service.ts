import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { ToastService } from '../toast/toast.service';

/**
 * Global error interceptor — converts HTTP errors into user-friendly toast messages.
 * Register AFTER HttpInterceptorService so that 401-with-refresh is handled first.
 */
@Injectable({ providedIn: 'root' })
export class ErrorInterceptorService implements HttpInterceptor {
  // private readonly toast = inject(ToastService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.resolveMessage(error);

        // Avoid duplicate toasts for auth endpoints that have their own UI feedback
        if (!this.isSilentEndpoint(request.url)) {
          // this.toast.showError(message);
        }

        return throwError(() => error);
      })
    );
  }

  private resolveMessage(error: HttpErrorResponse): string {
    // Server-provided message from RFC 7807 Problem Details
    const serverDetail: string | undefined =
      error.error?.detail ?? error.error?.message ?? error.error?.title;

    if (serverDetail) return serverDetail;

    switch (error.status) {
      case 0:   return 'Unable to reach the server. Please check your connection.';
      case 400: return 'Invalid request. Please check your inputs.';
      case 401: return 'Your session has expired. Please log in again.';
      case 403: return 'You do not have permission to perform this action.';
      case 404: return 'The requested resource was not found.';
      case 409: return 'A conflict occurred. The record may already exist.';
      case 422: return 'Validation failed. Please review your inputs.';
      case 429: return 'Too many requests. Please wait a moment and try again.';
      case 500: return 'An unexpected server error occurred. Please try again later.';
      case 503: return 'The service is temporarily unavailable. Please try again shortly.';
      default:  return `An error occurred (${error.status}). Please try again.`;
    }
  }

  private isSilentEndpoint(url: string): boolean {
    return (
      url.includes('/user/login') ||
      url.includes('/user/refresh-token')
    );
  }
}
