import { Component, ViewChild } from '@angular/core';
import { UserServiceService } from '../../services/user/user-service.service';
import { GlobalService } from '../../services/global/global.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  standalone:true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  displayedUserColumns: string[] = ['userId', 'personName', 'emailAddress', 'userName', 'roleName', 'modifiedBy', 'modifiedOn', 'isLocked', 'edit', 'delete'];
  displayedRoleColumns: string[] = ['roleId', 'roleName', 'description', 'delete'];
  index: number = 0;
  selectedTabIndex = 0;

  constructor(private _userService: UserServiceService, private _globalService: GlobalService,
      private _httpClient: HttpClient
  ) {
  }

  ngOnInit() {
    this.getUserList();
    this.getRoleList();
  }

  getUserList() {
    this._userService.getUserList().subscribe((res) => {
    },
    )
  }

  getRoleList() {
    this._userService.getRoleList().subscribe((res) => {
    },
    )
  }

  unlockUser(userId: number) {

  }

  editUser(userId: number) {

  }
  deleteUser(userId: number) {

  }
  editRole(roleId: number) {

  }
  deleteRole(roleId: number) {

  }

}
