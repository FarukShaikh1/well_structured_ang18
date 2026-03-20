import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionConstant, Messages } from '../../../utils/application-constants';
import { UserPermission } from '../../interfaces/user-permission';
import { CacheService } from '../../services/cache/cache.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { RoleService } from '../../services/role/role.service';
import { UserService } from '../../services/user/user.service';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
@Component({
  selector: 'app-user-permission',
  standalone: true,
  imports: [CommonModule, FormsModule, ToasterComponent, LoaderComponent],
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css'],
})
export class UserPermissionComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  rolePageMappingData: UserPermission[] = [];
  userList: any;
  disableUpdate: boolean = false;
  editable: boolean = false;
  cacheKey: string = 'UserPermission';
  selectedUserId: string = '';
  constructor(private userService: UserService, private roleService: RoleService, private loaderService: LoaderService, private cacheService: CacheService,
    public globalService: GlobalService) { }

  ngOnInit() {
    this.loaderService.showLoader();
    this.getUserList();
    this.editable = this.globalService.isAccessible(ActionConstant.EDIT)
    this.disableUpdate = true;
    this.getPermission("");
  }

  changeUser(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedUserId = select.value;
    localStorage.removeItem(this.cacheKey);

    if (!this.selectedUserId || this.selectedUserId === 'select') {
      this.disableUpdate = true;
      this.getPermission("");
    }
    else {
      this.disableUpdate = false;
      this.getPermission(this.selectedUserId);
    }

    const selectedRole = this.userList.find((role: any) => role.id == this.selectedUserId);
    if (selectedRole) {
    }
  }

  getUserList() {
    this.userService.getUserList().subscribe({
      next: (result: any) => {
        this.userList = result.data;
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.error('Error fetching user list', error);
        this.toaster.showMessage(error?.message, 'error');
        this.loaderService.hideLoader();
      },
    });
  }
  getPermission(userId: string) {
    // ✅ 1. Check cache first
    const cachedData = this.cacheService.get<any[]>(this.cacheKey); 
    if (cachedData) {
      this.rolePageMappingData = cachedData;
      return;
    }
    this.loaderService.showLoader();
    this.roleService.getPermission(userId).subscribe({
      next: (result: any) => {


        this.rolePageMappingData = result.data;
        this.cacheService.set(this.cacheKey, result.data);
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.error('Error fetching role data', error);
        this.toaster.showMessage(error?.message, 'error');
        this.loaderService.hideLoader();
      },
    });
  }

  updateRoleModulePermission(role: UserPermission) {
    const updatedData: UserPermission = {
      userId: this.selectedUserId,
      moduleId: role.moduleId,
      moduleName: role.moduleName,
      view: role.view,
      add: role.add,
      edit: role.edit,
      delete: role.delete,
      download: role.download,
      upload: role.upload,
      approve: role.approve,
    };

    this.roleService.updateUserPermission(updatedData).subscribe(
      () => {
        this.toaster.showMessage(
          Messages.ROLE_MODULE_MAPPING_UPDATED_SUCCESSFULLY,
          'success'
        );
      },
      (error) => {
        console.error(
          Messages.ERROR_IN_FETCH_ROLE_MODULE_MAPPINGS,
          error
        );
        this.toaster.showMessage('Failed to update.', 'error');
      }
    );
  }
}
