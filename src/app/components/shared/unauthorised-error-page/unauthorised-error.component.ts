import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader/loader.service';
import { LogoutService } from '../../../services/logout/logout.service';

@Component({
  selector: 'app-unauthorised-error',
  standalone: true,
  imports: [],
  templateUrl: './unauthorised-error.component.html',
  styleUrl: './unauthorised-error.component.css',
})
export class UnauthorisedErrorComponent implements OnInit {
  constructor(
    private logoutService: LogoutService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    
    this.loaderService.hideLoader();
  }

  backToLogin() {
    this.logoutService.logout();
  }
}
