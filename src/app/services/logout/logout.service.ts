import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
// import { SignalRService } from '../../services/signal-r/signal-r.service';
import { NavigationURLs } from '../../../utils/application-constants';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    // private signalRService: SignalRService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    public authService: OktaAuthStateService
  ) { }

  async logout() {
    // this.signalRService.closeConnection();

    // For Okta logout
    // if (this.localStorageService.isSsoLogin()) {
    //   try {
    //     // Clear tokens manually before logging out
    //     this.oktaAuth.tokenManager.clear();
  
    //     await this.oktaAuth.signOut({
    //       postLogoutRedirectUri: window.location.origin + '/login', // Redirect back to login after logout
    //     });
  
    //     this.localStorageService.clear();
    //     localStorage.setItem('initiatedLogout', 'true');
    //   } catch (error) {
    //     console.error('Error during logout:', error);
    //   }
    // } else {
    //   this.localStorageService.clear();
    //   this.router.navigate([NavigationURLs.LOGIN]);
    // }

    // **** Currently using same logout approach for both okta and form based logout **** 
    this.localStorageService.clear();
    sessionStorage.clear(); 
    this.router.navigate([NavigationURLs.LOGIN]);
  }
}
