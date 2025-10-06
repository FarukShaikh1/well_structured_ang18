import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service
import { GlobalService } from '../../services/global/global.service';
import { HttpClient } from '@angular/common/http';
import { RoleService } from '../../services/role/role.service';

interface TreeNode {
  label: string;
  checked: boolean;
  indeterminate: boolean;
  children?: TreeNode[];
}

@Component({
  selector: 'app-manage-roles',
  standalone:true,
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss']
})
export class ManageRolesComponent {
  displayedRoleColumns: string[] = ['roleId', 'roleName', 'description', 'delete'];
  rolesDataSource!: any;
  reverse: boolean = false;
  isAllChecked: boolean = false;
  sortDir = 1;
  sortClickCount = 0;
  selectedCheckboxMap: { [key: number]: boolean } = {};
  page: number = 1;
  count: number = 0;
  itemCountList: string = '';
  pageSizeOptions = [5];
  itemsPerPage = 5;
  key: string = '';

  constructor(private roleService: RoleService, public globalService: GlobalService,
      private _httpClient: HttpClient
  ) {
  }

  ngOnInit() {
    this.getRoleList();
  }

  getRoleList() {
    this.roleService.getAllRoles().subscribe((res) => {
      this.rolesDataSource = res.data;
    },
    )
  }
  editRole(roleId: number) {

  }
  deleteRole(roleId: number) {

  }
  rowClicked(value: string) {

  }
  itemcount(): string {
    const recordsPerPage = this.itemsPerPage;
    const totalRecords = this.rolesDataSource?.length;
    const currentPage = this.page; 

    let startRecord = (currentPage - 1) * recordsPerPage + 1;
    startRecord = this.rolesDataSource?.length > 0 ? startRecord : 0;
    let endRecord = currentPage * recordsPerPage;
    endRecord = Math.min(endRecord, totalRecords);

    return startRecord + '-' + endRecord;
  }

  onSortClick(event: any, column: string) {
    const target = event.currentTarget;
    const classList = target.classList;

    if (
      !classList.contains('bi-arrow-up') &&
      !classList.contains('bi-arrow-down')
    ) {
      
      classList.add('bi-arrow-up');
      this.sortDir = 1;
    } else if (classList.contains('bi-arrow-up')) {
      
      classList.remove('bi-arrow-up');
      classList.add('bi-arrow-down');
      this.sortDir = -1;
    } else {
      classList.remove('bi-arrow-up', 'bi-arrow-down'); 
      this.sortDir = 0; 
    }

    this.sortarr(column); 
  }
  sortarr(key: string) {
    if (this.key === key) {
      if (this.reverse) {
        
        this.reverse = false;
      } else {
        
        this.reverse = true;
      }
    } else {
      
      this.key = key;
      this.reverse = false;
    }

    
    if (!this.reverse) {
      
      this.rolesDataSource.sort((a: any, b: any) => {
        const valueA = a[key]?.toLowerCase();
        const valueB = b[key]?.toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      
      this.rolesDataSource.sort((a: any, b: any) => {
        const valueA = a[key]?.toLowerCase();
        const valueB = b[key]?.toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    this.sortClickCount++;

    if (this.sortClickCount === 3) {
      
      this.sortClickCount = 0; 
    }
  }


  nodes: TreeNode[] = [
    {
      label: 'Parent 1',
      checked: false,
      indeterminate: false,
      children: [
        { label: 'Child 1.1', checked: false, indeterminate: false },
        { label: 'Child 1.2', checked: false, indeterminate: false }
      ]
    },
    {
      label: 'Parent 2',
      checked: false,
      indeterminate: false,
      children: [
        { label: 'Child 2.1', checked: false, indeterminate: false },
        { label: 'Child 2.2', checked: false, indeterminate: false }
      ]
    }
  ];

  onParentChange(node: TreeNode) {
    node.checked = !node.checked;
    node.indeterminate = false;
    if (node.children) {
      node.children.forEach(child => {
        child.checked = node.checked;
      });
    }
  }

  onChildChange(parent: TreeNode, child: TreeNode) {
    child.checked = !child.checked;
    const allChecked = parent.children!.every(c => c.checked);
    const noneChecked = parent.children!.every(c => !c.checked);
    parent.checked = allChecked;
    parent.indeterminate = !allChecked && !noneChecked;
  }


}
