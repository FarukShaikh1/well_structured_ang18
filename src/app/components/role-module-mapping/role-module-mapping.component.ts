import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../interfaces/role';
import { UserPermission } from '../../interfaces/role-module-mapping';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { RoleService } from '../../services/role/role.service';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { Messages, ActionConstant, ApplicationModules } from '../../../utils/application-constants';
@Component({
  selector: 'app-role-module-mapping',
  standalone: true,
  imports: [CommonModule, FormsModule, ToasterComponent, LoaderComponent],
  templateUrl: './role-module-mapping.component.html',
  styleUrls: ['./role-module-mapping.component.css'],
})
export class RoleModuleMappingComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  rolePageMappingData: UserPermission[] = [];

  constructor(private roleService: RoleService, private loaderService: LoaderService, public globalService: GlobalService) { }

  ngOnInit() {
    this.loaderService.showLoader();
    // this.getRoleList();
    this.getPermission('c3d0a1d1-78f3-4128-8c22-c394ad7f55e5');
  }

  getPermission(userId: string) {
    this.loaderService.showLoader();
    this.roleService.getPermission(userId).subscribe({
      next: (result : any) => {
        debugger
        // Sort the data by pageId
        this.rolePageMappingData = result; 
        this.loaderService.hideLoader();
      },
      error: (error : any) => {
        console.error('Error fetching role data', error);
        this.toaster.showMessage(error?.message,'error');
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
    return this.globalService.isAccessible(ActionConstant.EDIT);
  }
}
