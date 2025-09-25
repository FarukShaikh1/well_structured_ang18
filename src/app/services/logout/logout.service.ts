import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

import { NavigationURLs } from '../../../utils/application-constants';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    public authService: OktaAuthStateService
  ) { }

  async logout() {
    this.localStorageService.clear();
    sessionStorage.clear();
    this.router.navigate([NavigationURLs.LOGIN]);
  }
}
