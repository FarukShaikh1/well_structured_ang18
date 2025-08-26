import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as forms from '@angular/forms';
import { Router } from '@angular/router';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import {
  ActionConstant,
  ApplicationConstantHtml,
  ApplicationModules,
  ApplicationTableConstants,
  Messages,
} from '../../../utils/application-constants';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { UserService } from '../../services/user/user.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { TabulatorGridComponent } from '../shared/tabulator-grid/tabulator-grid.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    forms.ReactiveFormsModule,
    ToasterComponent,
    UserDetailsComponent,
    TabulatorGridComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  providers: [],
})  
export class UserListComponent implements OnInit {
  @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
  @ViewChild('searchInput') searchInput!: ElementRef;
  public filteredTableData: Record<string, unknown>[] = [];
  public tableData: Record<string, unknown>[] = [];
  public columnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];
  searchText: string = '';
  noDataMessage = 'No Data Exists.';
  noMatchingDataMessage = 'No Data Exists.';
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(UserDetailsComponent) userDetailsComponent!: UserDetailsComponent;
  @ViewChild(ConfirmationDialogComponent)
  confirmModalComponent!: ConfirmationDialogComponent;
  Modules = ApplicationModules;
  ActionConstant = ActionConstant;
  sourceOrReason: any;
  id: string = '';

  constructor(
    private userService: UserService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.columnConfiguration();

    this.loadGrid();
    this.globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.USER) {
        this.loadGrid();
      }
    });
    this.globalService.refreshList$.subscribe((listName: string) => {
      if (listName === ApplicationModules.USER) {
        this.applySearch();
      }
    });
  }

  ngAfterViewInit() {
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest('.OPTIONS_MENU_THREE_DOTS')) {
        const button = target.closest('.OPTIONS_MENU_THREE_DOTS') as HTMLElement;
        const rowId = button.getAttribute('data-row-id');
        if (rowId) {
          const rowData = this.tableData.find((row) => row['id'] == rowId);
          if (rowData) {
            const menuOptions = this.generateOptionsMenu(rowData);
            this.globalService.showGlobalDropdownMenu(button, menuOptions);
          }
        }
        event.stopPropagation();
      } else { // Hide global dropdown
        const globalMenu = document.getElementById('globalDropdownMenu');
        if (globalMenu) globalMenu.remove();
      }
    });
  }

  columnConfiguration() {
    this.columnConfig = [
      {
        title: 'Name',
        field: 'firstName',
        sorter: 'string',
      },
      { title: 'Email Id', field: 'emailAddress', sorter: 'string' },
      {
        title: "Mobile Number",
        field: "mobileNumber",
        sorter: "alphanum",
      },
      { title: 'Role', field: 'roleName', sorter: 'string' },
      {
        title: 'Statussss',
        field: 'isLocked',
        sorter: 'string',
        formatter: this.globalService.statusFormatter.bind(this),
      },
      {
        title: "",
        field: "",
        maxWidth: 70,
        formatter: this.globalService.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const id = cell.getRow().getData()["id"];
          this.hideUser(id);
        },
        hozAlign: "center",
        headerSort: false,
      },
    ];
    if (
      this.globalService.isAccessible(ActionConstant.EDIT)||
      this.globalService.isAccessible(ActionConstant.DELETE)
    ) {
      this.columnConfig.push({
        title: "",
        field: "option",
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),//will used for row-wise condition
        hozAlign: "center",
        headerSort: false,
      });
    }
  }

  generateOptionsMenu(rowData: Record<string, any>) {
    const menu = [];
    if (this.globalService.isAccessible(ActionConstant.EDIT)) {
      menu.push({
        label: ApplicationConstantHtml.EDIT_LABLE,
        action: () => {
          this.openUserDetailsPopup(rowData['id']);
        },
      });
    }
    if (this.globalService.isAccessible(ActionConstant.DELETE)) {
      menu.push({
        label: ApplicationConstantHtml.DELETE_LABLE,
        action: () => {
          this.deactivateUser(rowData['id'], true);
        },
      });
    }
    return menu;
  }

  viewUserProfile(id: string | null | undefined) {
    if (id) {
      this.router.navigate(['home/user-profile']);
    }
  }

  editUser(id: string) {
    if (id) {
      this.openUserDetailsPopup(id);
    }
  }

  deactivateUser(id: string, isdeactivate: boolean) {
    if (id) {
      // Logic to handle user deactivation
      if (isdeactivate) {
        this.confirmModalComponent.openConfirmationPopup(
          'Confirmation',
          'Are you sure you want to deactivate this user? Once deactivated, the user will no longer be able to log in.'
        );
      } else {
        this.confirmModalComponent.openConfirmationPopup(
          'Confirmation',
          'Are you sure you want to reactivate this user?'
        );
      }
    } else {
    }
  }

  handleConfirmResult(result: boolean) {
    if (result) {
      //add logic for activate / deactivate
    }
  }

  loadGrid() {
    this.loaderService.showLoader();
    this.userService.getAllUsers().subscribe({
      next: (result: any) => {
        if (result) {
          this.tableData = result.data;
          this.filteredTableData = result.data;
        } else {
          console.error(Messages.ERROR_IN_FETCH_USER);
          this.toaster.showMessage(Messages.ERROR_IN_FETCH_USER, 'error');
        }
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.error(Messages.ERROR_IN_FETCH_USER, error);
        this.loaderService.hideLoader();
      },
    });
  }

  hideUser(userId: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.id != userId;
    });
  }

  searchByText(event: any) {
    this.searchText = event.target.value?.toLowerCase();
    this.applySearch();
  }

  applySearch() {
    this.filteredTableData = this.tableData.filter((row: any) => {
      const userNameMatch = row.userName?.toLowerCase().includes(this.searchText);
      const emailMatch = row.email?.toLowerCase().includes(this.searchText);
      const roleMatch = row.role?.toLowerCase().includes(this.searchText);
      let userStatus = '';
      if (row.isDeactivated) {
        userStatus = 'inactive';
      }
      else {
        userStatus = 'active';
      }
      const statusMatch = userStatus.includes(this.searchText);
      return userNameMatch || emailMatch || roleMatch || statusMatch;
    });

    if (this.filteredTableData && this.filteredTableData.length) {
      this.tabulatorGrid.clearEmptyCellSelection();
    }

    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
    // this.tabulatorGrid.applySearch(this.searchText);
  }

  openUserDetailsPopup(id: string) {
    this.userDetailsComponent.openUserDetailsPopup(id);
  }

  filterGridBySearch(data: any) {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
    this.sourceOrReason = data?.target?.value?.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTableData = this.tableData.filter((item: any) => {
      const searchText =
        item.userName?.toLowerCase().includes(this.sourceOrReason) ||
        item.userName?.toLowerCase().includes(this.sourceOrReason) ||
        item.userName?.toLowerCase().includes(this.sourceOrReason) ||
        item.description?.toLowerCase().includes(this.sourceOrReason);
      return searchText;
    });
  }
}
