import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionConstant, Messages } from '../../../utils/application-constants';
import { UserPermission } from '../../interfaces/user-permission';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { RoleService } from '../../services/role/role.service';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { UserService } from '../../services/user/user.service';
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

  constructor(private userService: UserService, private roleService: RoleService, private loaderService: LoaderService, public globalService: GlobalService) { }

  ngOnInit() {
    this.loaderService.showLoader();
    this.getUserList();
  }

  changeUser(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedId = select.value;
    const selectedRole = this.userList.find((role: any) => role.id == selectedId);
    if (selectedRole) {
      console.log('Selected Username:', selectedRole.name);
      console.log('Selected User ID:', selectedRole.id);
    }
    this.getPermission(selectedId);
  }

  getUserList() {
    this.userService.getUserList().subscribe({
      next: (result: any) => {
        debugger
        this.userList = result;
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
    this.loaderService.showLoader();
    this.roleService.getPermission(userId).subscribe({
      next: (result: any) => {

        // Sort the data by pageId
        this.rolePageMappingData = result;
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.error('Error fetching role data', error);
        this.toaster.showMessage(error?.message, 'error');
        this.loaderService.hideLoader();
      },
    });
  }

  updateRoleModulePermission() {
    const updatedData: UserPermission[] = this.rolePageMappingData.map(
      (mapping: UserPermission) => ({
        ...mapping,
        view: mapping.view || false,
        add: mapping.add || false,
        edit: mapping.edit || false,
        delete: mapping.delete || false,
        download: mapping.download || false,
        upload: mapping.upload || false,
      })
    );

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

  isMappingEditable(): boolean {
    return this.globalService.isAccessible(ActionConstant.EDIT);
  }
}
