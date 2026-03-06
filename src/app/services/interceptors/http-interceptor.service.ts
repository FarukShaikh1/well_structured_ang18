import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  throwError
} from 'rxjs';
import {
  catchError,
  filter,
  switchMap,
  take
} from 'rxjs/operators';
import { NavigationURLs } from '../../../utils/application-constants';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class HttpInterceptorService implements HttpInterceptor {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  /** Prevents multiple parallel refresh calls. */
  private isRefreshing = false;
  private readonly refreshToken$ = new BehaviorSubject<string | null>(null);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Attach access token to every outbound request (except refresh-token itself)
    const accessToken = this.localStorageService.getLoggedInUserData()?.accessToken;
    request = this.addAuthHeader(request, accessToken);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthEndpoint(request.url)) {
          return this.handle401(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private addAuthHeader(
    request: HttpRequest<unknown>,
    token?: string
  ): HttpRequest<unknown> {
    if (!token) return request;
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  /**
   * When a 401 arrives, attempt a single token refresh.
   * All other requests queued during refresh are replayed after new token is received.
   */
  private handle401(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      // Wait for the ongoing refresh to complete, then replay
      return this.refreshToken$.pipe(
        filter((token): token is string => token !== null),
        take(1),
        switchMap(token => next.handle(this.addAuthHeader(request, token)))
      );
    }

    this.isRefreshing = true;
    this.refreshToken$.next(null);

    const storedRefreshToken = this.localStorageService.getLoggedInUserData()?.refreshToken;

    if (!storedRefreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.userService.refreshToken(storedRefreshToken).pipe(
      switchMap(response => {
        this.isRefreshing = false;
        const newAccessToken: string = response?.data?.accessToken ?? '';

        // Persist the new tokens
        const userData = this.localStorageService.getLoggedInUserData();
        this.localStorageService.setLoggedInUserData({
          ...userData,
          accessToken: newAccessToken,
          refreshToken: response?.data?.refreshToken ?? storedRefreshToken
        });

        this.refreshToken$.next(newAccessToken);
        return next.handle(this.addAuthHeader(request, newAccessToken));
      }),
      catchError(refreshError => {
        this.isRefreshing = false;
        this.logout();
        return throwError(() => refreshError);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return (
      url.includes('/user/login') ||
      url.includes('/user/refresh-token') ||
      url.includes('/otp/')
    );
  }

  private logout(): void {
    this.localStorageService.clear();
    this.router.navigate([NavigationURLs.LOGIN ?? '/login']);
  }
}
