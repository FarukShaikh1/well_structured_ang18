import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global/global.service';
import { NavigationURLs } from '../../../utils/application-constants';

@Component({
  selector: 'app-logout',
  standalone:true,
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router, public globalService: GlobalService) { }

  ngOnInit() {    
            console.log('logoutComponent 16 Clearing local storage');

    localStorage.clear();
    this.reload();
    this.router.navigate([NavigationURLs.HOME]);
  }
  reload() {
    this.globalService.reloadComponent();
  }

}
