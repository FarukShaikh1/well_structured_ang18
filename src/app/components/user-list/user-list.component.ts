import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as forms from '@angular/forms';
import { Router } from '@angular/router';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import {
  ActionConstant,
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
  Module_Actions = ActionConstant;
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

  columnConfiguration() {

    this.columnConfig = [
      {
        title: 'Name',
        field: 'firstName',
        sorter: 'string',
        formatter: this.nameFormatter.bind(this),
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
        formatter: this.isLockedFormatter.bind(this),
      },
      {
        title: "-",
        field: "-",
        maxWidth: 50,
        formatter: this.globalService.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const id = cell.getRow().getData()["id"];
          // this.hideUser(id);
        },
        headerSort: false,
      },
      {
        title: "",
        field: "options",
        maxWidth: 50,
        formatter: this.threeDotsFormatter.bind(this),
        hozAlign: "left",
        headerSort: false,
      },

    ];
  }
  threeDotsFormatter(cell: CellComponent) {

    const rowData = cell.getRow().getData();
    const rowId = rowData['id'];
    const optionsMenu = this.generateOptionsMenu(rowData); // Generate dynamic menu for row

    // If no menu items to show
    if (optionsMenu.length === 0) {
      return '';
      // Use this if need to show disabled three dots
      // return '<button class="action-buttons disabled" title="No Actions Available" disabled><i class="bi bi-three-dots"></i></button>';
    }

    return `
        <button class="btn btn-link OPTIONS_MENU_THREE_DOTS action-buttons p-0" type="button" data-row-id="${rowId}" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-three-dots"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end options-menu" aria-labelledby="dropdownMenu${rowId}" id="dropdownMenuItems${rowId}">
        </ul>
      `;
  }
  generateOptionsMenu(rowData: Record<string, any>) {
    const menu = [];
    if (
      // rowData['id'] &&
      // this.globalService.isAccessible(ApplicationModules.DAY, ActionConstant.EDIT)
      this.globalService.isAccessible(ActionConstant.EDIT)
    )
    {
      menu.push({
        label: `<a class="dropdown-item btn-link options-menu-item"
            data-bs-toggle="modal" data-bs-target="#userDetailsPopup">
                <i class="bi bi-pencil"></i>
                  &nbsp;Edit
                </a>
                `,
        action: (_e: any, cell: CellComponent) => {
          const expenseData = cell.getRow().getData();
          const expenseId = expenseData["id"];
          this.openUserDetailsPopup(expenseId);
        },

      });
    }
      menu.push({
        label: `<a class="dropdown-item btn-link"
              data-bs-toggle="modal" data-bs-target="#confirmationPopup">
                  <i class="bi bi-trash"></i>
                    &nbsp;Delete
                  </a>
                  `,
        action: (_e: any, cell: CellComponent) => {
          const expenseData = cell.getRow().getData();
          const id = expenseData["id"];
          this.deactivateUser(id, id);
        },
      });
    
    return menu;
  }

  nameFormatter(cell: CellComponent) {
    // const firstName = cell.getColumn().getField();
    const userData = cell.getRow().getData();
    const columnValue = userData['firstName'] + ' ' + userData['lastName'];
    return `<span class="name-col-values">${cell.getValue()}</span>`;
  }

  statusFormatter(cell: CellComponent) {
    const statusValue = cell.getValue();
    if (statusValue) {
      this.columnConfig[4].visible = false;
      return '<span style="color:gray">Inactive</span>';
    } else {
      return '<span style="color:#ff7a00">Active</span>';
    }
  }

  isLockedFormatter(cell: CellComponent) {
    const columnName = cell.getColumn().getField();
    const userData = cell.getRow().getData();
    const columnValue = userData[columnName];
    if (columnValue) {
      return '<span style="color:gray">Locked</span>';
    } else {
      return '<span style="color:#ff7a00">Active</span>';
    }
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
    if (result) { }
  }

  loadGrid() {
    this.loaderService.showLoader();
    this.userService.getAllUsers().subscribe({
      next: (result: any) => {
        if (result) {
          this.tableData = result;
          this.filteredTableData = result;
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
