import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-logout',
  standalone:true,
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router, public globalService: GlobalService) { }

  ngOnInit() {
    
    
    
    
    localStorage.clear();
    this.reload();

    this.router.navigate(["login"]);
  }
  reload() {
    this.globalService.reloadComponent();
  }

}
