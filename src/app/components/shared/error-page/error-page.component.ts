import { Component } from '@angular/core';
import { LogoutService } from '../../../services/logout/logout.service';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  constructor(
    private logoutService: LogoutService
  ) { }

  backToLogin() {
    this.logoutService.logout();
  }
}
