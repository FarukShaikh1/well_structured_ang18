import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationURLs } from '../../../../utils/application-constants';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { LogoutService } from '../../../services/logout/logout.service';

@Component({
  selector: 'app-site-under-development',
  standalone: true,
  imports: [],
  templateUrl: './site-under-development.component.html',
  styleUrl: './site-under-development.component.css'
})
export class SiteUnderDevelopmentComponent {
  constructor(private router: Router,
    public localStorageService: LocalStorageService,
    private logoutService: LogoutService,
  ) {
    this.alreadyLoggedIn = localStorageService.isAuthenticated();
  }
  NavigationURLs = NavigationURLs;
  alreadyLoggedIn: boolean = true;

  ngOnInit() {
    console.log('Site Under Development Loaded');
  }
  logout(): void {
    this.router.navigate(['home']);
    // this.logoutService.logout();
  }
  occasionList(): void {
    this.router.navigate([NavigationURLs.DAY_LIST]);
  }
}
