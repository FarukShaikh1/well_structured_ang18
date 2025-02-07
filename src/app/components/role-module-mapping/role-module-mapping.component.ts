import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../interfaces/role';
import { RoleModuleMapping } from '../../interfaces/role-module-mapping';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { RoleService } from '../../services/role/role.service';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { Messages, ApplicationModuleActions, ApplicationModules } from '../../../utils/application-constants';
@Component({
  selector: 'app-role-module-mapping',
  standalone: true,
  imports: [CommonModule, FormsModule, ToasterComponent, LoaderComponent],
  templateUrl: './role-module-mapping.component.html',
  styleUrls: ['./role-module-mapping.component.css'],
})
export class RoleModuleMappingComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  Modules = ApplicationModules;
  Module_Actions = ApplicationModuleActions;

  selectedRoleId: string = '';
  roleList: Role[] = [];
  rolePageMappingData: RoleModuleMapping[] = [];

  constructor(private roleService: RoleService, private loaderService: LoaderService, public globalService: GlobalService) { }

  ngOnInit() {
    this.loaderService.showLoader();
    this.getRoleList();
  }

  /**
   * @description Fetches the list of all roles and sets the `roleList` property with the retrieved data.
   * If the `roleList` contains any roles, the first role's ID is used to fetch the role-module
   * mappings for that role by calling the `getRoleModuleMappingByRoleId` method.
   * Upon a successful response, it updates the `roleList` property and calls
   * `getRoleModuleMappingByRoleId` with the first role's ID.
   * If an error occurs, it logs the error message.
   *
   * @returns {void}
   */
  getRoleList() {
    this.roleService.getAllRoles().subscribe({
      next: (result : any) => {
        this.roleList = result?.data;
        if (this.roleList.length) {
          this.selectedRoleId = this.roleList[0]?.id;
          this.getRoleModuleMappingByRoleId(this.selectedRoleId);
        }
      },
      error: (error : any) => {
        console.error(
          Messages.ERROR_IN_FETCHING_ROLES,
          error
        );
        this.toaster.showMessage(error?.message,'error');
        this.loaderService.hideLoader();
      },
    });
  }

  /**
   * @description Fetches the role-module mappings for a given role ID and sorts the data by page ID.
   * This method subscribes to the `getRoleModuleMappingByRoleId` observable from the `RoleService`.
   * Upon a successful response, it sorts the retrieved data by `pageId` and updates the
   * `rolePageMappingData` property. If an error occurs, it logs the error message.
   *
   * @param {string} selectedRoleId - The ID of the selected role for which to fetch the role-module mappings.
   *
   * @returns {void}
   */
  getRoleModuleMappingByRoleId(selectedRoleId: string) {
    this.loaderService.showLoader();
    this.roleService.getRoleModuleMappingByRoleId(selectedRoleId).subscribe({
      next: (result : any) => {
        // Sort the data by pageId
        this.rolePageMappingData = (result?.data || []).sort(
          (a: { pageId: number }, b: { pageId: number }) => a.pageId - b.pageId
        );
        this.loaderService.hideLoader();
      },
      error: (error : any) => {
        console.error('Error fetching role data', error);
        this.toaster.showMessage(error?.message,'error');
        this.loaderService.hideLoader();
      },
    });
  }

  changeRole(event: Event) {
    this.selectedRoleId = (event.target as HTMLSelectElement).value;
    this.getRoleModuleMappingByRoleId(this.selectedRoleId);
  }

  updateRoleModulePermission() {
    const updatedData: RoleModuleMapping[] = this.rolePageMappingData.map(
      (mapping: RoleModuleMapping) => ({
        ...mapping,
        view: mapping.view || false,
        add: mapping.add || false,
        edit: mapping.edit || false,
        delete: mapping.delete || false,
        download: mapping.download || false,
        upload: mapping.upload || false,
      })
    );

    this.roleService.updateRoleModuleMapping(updatedData).subscribe(
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
    return this.globalService.isAccessible(ApplicationModules.ROLE_MODULE_MAPPING, ApplicationModuleActions.EDIT);
  }
}
