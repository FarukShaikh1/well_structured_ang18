import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { ActionConstant, ApplicationConstantHtml, ApplicationTableConstants, Messages } from "../../../utils/application-constants";
import { ConfigurationService } from "../../services/configuration/configuration.service";
import { GlobalService } from '../../services/global/global.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { UserService } from "../../services/user/user.service";
import { ConfigurationDetailsComponent } from '../configuration-details/configuration-details.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TabulatorGridComponent,ConfigurationDetailsComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
  @ViewChild(ConfigurationDetailsComponent) configDetailsComponent!: ConfigurationDetailsComponent;
  @ViewChild('searchInput') searchInput!: ElementRef;
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];
  searchText: string = '';
  noDataMessage = 'No Data Exists.';
  noMatchingDataMessage = 'No Data Exists.';
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(ConfirmationDialogComponent)
  confirmModalComponent!: ConfirmationDialogComponent;

  userColumnConfig: ColumnDefinition[] = [];
  accountColumnConfig: ColumnDefinition[] = [];
  occasionTypeColumnConfig: ColumnDefinition[] = [];
  relationColumnConfig: ColumnDefinition[] = [];

  filteredUserTableData: Record<string, unknown>[] = [];
  filteredAccountTableData: Record<string, unknown>[] = [];
  filteredRelationTableData: Record<string, unknown>[] = [];
  filteredOccasionTypeTableData: Record<string, unknown>[] = [];

  userTableData: Record<string, unknown>[] = [];
  accountTableData: Record<string, unknown>[] = [];
  relationTableData: Record<string, unknown>[] = [];
  occasionTypeTableData: Record<string, unknown>[] = [];

  isSuperAdmin = false;
  configOptionsMenu = [
    {
      label: `<a class="dropdown-item btn-link"
              data-bs-toggle="modal" data-bs-target="#configDetailsPopup">
                  <i class="bi bi-pencil"></i>
                    &nbsp;Edit
                  </a>
                  `,
      action: (_e: any, cell: CellComponent) => {
        const reportData = cell.getRow().getData();
        const reportId = reportData['id'];
        this.editUser(reportId);
      },
    },
    {
      separator: true,
    },
    {
      label: ApplicationConstantHtml.DELETE_LABLE,
      action: (_e: any, cell: CellComponent) => {
        const reportData = cell.getRow().getData();
        const reportId = reportData['id'];
        this.deleteUser(reportId);
      },
    },
  ];

  constructor(
    private configurationService: ConfigurationService,
    public globalService: GlobalService,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    debugger;
    var data = this.localStorageService.getLoggedInUserData();
    var userId = data?.id;
    if (data.roleName !== 'Super Admin') {
      this.isSuperAdmin = true;
      this.loadUserGrid(userId)
    }
    else {
      this.isSuperAdmin = false;
      this.loadAccountGrid(userId);
      this.loadRelationGrid(userId);
      this.loadOccasionTypeGrid(userId);
    }
  }

  ngAfterViewInit() {
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest('.OPTIONS_MENU_THREE_DOTS')) {
        const button = target.closest('.OPTIONS_MENU_THREE_DOTS') as HTMLElement;
        const rowId = button.getAttribute('data-row-id');
        debugger
        if (rowId) {
          const accountRowData = this.accountTableData.find((row) => row['id'] == rowId);
          const relationRowData = this.relationTableData.find((row) => row['id'] == rowId);
          const OccasionTypeRowData = this.occasionTypeTableData.find((row) => row['id'] == rowId);
          if (accountRowData) {
            const menuOptions = this.generateOptionsMenu(accountRowData,'account');
            this.globalService.showGlobalDropdownMenu(button, menuOptions);
          }
          else if (relationRowData) {
            const menuOptions = this.generateOptionsMenu(relationRowData,'relation');
            this.globalService.showGlobalDropdownMenu(button, menuOptions);
          }
          else if (OccasionTypeRowData) {
            const menuOptions = this.generateOptionsMenu(OccasionTypeRowData, 'occasiontype');
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

  generateOptionsMenu(rowData: Record<string, any>,config:string) {
    const menu = [];
    menu.push({
      label: ApplicationConstantHtml.EDIT_LABLE,
      action: () => {
        this.openDetailPopup(config, rowData['id']);
      },
    });
    if (rowData['isUsed'] === false) {
      menu.push({
        label: ApplicationConstantHtml.DELETE_LABLE,
        action: () => {
          this.deleteItem(config,rowData['id']);
        },
      });
    }
    return menu;
  }

  openDetailPopup(config: string, id: string) {
    debugger
    this.configDetailsComponent.openDetailsPopup(config, id);
  }

  loadAccountGrid(userId: string) {
    this.accountColumnConfiguration();
    this.configurationService.getAccounts(userId).subscribe({
      next: (result: any) => {
        debugger
        this.filteredAccountTableData = result;
        this.accountTableData = result;
      },
      error: (error: any) => {
        console.error('Error fetching user list', error);
      },
    });
  }

  loadUserGrid(userId: string) {
    this.userColumnConfiguration();
    this.userService.getAllUsers().subscribe({
      next: (result: any) => {
        if (result) {
          this.filteredUserTableData = result;
          this.userTableData = result;
        } else {
          console.error(Messages.ERROR_IN_FETCH_USER);
        }
      },
      error: (error: any) => {
        console.error(Messages.ERROR_IN_FETCH_USER, error);
      },
    });
  }

  loadRelationGrid(userId: string) {
    this.relationColumnConfiguration();
    this.configurationService.getRelationTypes(userId).subscribe({
      next: (result: any) => {
        if (result) {
          this.filteredRelationTableData = result;
          this.relationTableData = result;
        } else {
          console.error(Messages.ERROR_IN_FETCH_USER);
        }
      },
      error: (error: any) => {
        console.error(Messages.ERROR_IN_FETCH_USER, error);
      },
    });
  }

  loadOccasionTypeGrid(userId: string) {
    this.occasionTypeColumnConfiguration();
    this.configurationService.getOccasionTypes(userId).subscribe({
      next: (result: any) => {
        if (result) {
          this.filteredOccasionTypeTableData = result;
          this.occasionTypeTableData = result;
        } else {
          console.error(Messages.ERROR_IN_FETCH_USER);
        }
      },
      error: (error: any) => {
        console.error(Messages.ERROR_IN_FETCH_USER, error);
      },
    });
  }


  userColumnConfiguration() {
    this.userColumnConfig = [
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
      this.globalService.isAccessible(ActionConstant.EDIT) ||
      this.globalService.isAccessible(ActionConstant.DELETE)
    ) {
      this.userColumnConfig.push({
        title: "",
        field: "option",
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),//will used for row-wise condition
        hozAlign: "center",
        headerSort: false,
      });
    }
  }

  accountColumnConfiguration() {
    this.accountColumnConfig = [
      {
        title: 'Account Name',
        field: 'accountName',
        sorter: 'string',
      },
      { title: 'Description', field: 'description', sorter: 'string' },
      {
        title: "Display Order",
        field: "displayOrder",
        sorter: "alphanum",
      },
      { title: 'Is Active?', field: 'isActive', sorter: 'string' },
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
          this.hideAccount(id);
        },
        hozAlign: "center",
        headerSort: false,
      },
      {
        title: '',
        field: 'options',
        maxWidth: 50,
        formatter: (_cell) =>
          '<button class="action-buttons" title="More Actions" style="padding-right:100px"><i class="bi bi-three-dots btn-link"></i></button>',
        clickMenu: this.configOptionsMenu,
        hozAlign: 'left',
        headerSort: false,
      },

    ];
    if (
      this.globalService.isAccessible(ActionConstant.EDIT) ||
      this.globalService.isAccessible(ActionConstant.DELETE)
    ) {
      this.accountColumnConfig.push({
        title: "",
        field: "option",
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),//will used for row-wise condition
        hozAlign: "center",
        headerSort: false,
      });
    }
  }

  occasionTypeColumnConfiguration() {
    this.occasionTypeColumnConfig = [
      {
        title: 'OccasionType Name',
        field: 'occasionTypeName',
        sorter: 'string',
      },
      { title: 'Description', field: 'description', sorter: 'string' },
      {
        title: "Display Order",
        field: "displayOrder",
        sorter: "alphanum",
      },
      { title: 'Is Active?', field: 'isActive', sorter: 'string' },
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
          this.hideOccasionType(id);
        },
        hozAlign: "center",
        headerSort: false,
      },
    ];
    if (
      this.globalService.isAccessible(ActionConstant.EDIT) ||
      this.globalService.isAccessible(ActionConstant.DELETE)
    ) {
      this.occasionTypeColumnConfig.push({
        title: "",
        field: "option",
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),//will used for row-wise condition
        hozAlign: "center",
        headerSort: false,
      });
    }
  }

  relationColumnConfiguration() {
    this.relationColumnConfig = [
      {
        title: 'RelationType Name',
        field: 'accountName',
        sorter: 'string',
      },
      { title: 'Description', field: 'description', sorter: 'string' },
      {
        title: "Display Order",
        field: "displayOrder",
        sorter: "alphanum",
      },
      { title: 'Is Active?', field: 'isActive', sorter: 'string' },
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
          this.hideRelation(id);
        },
        hozAlign: "center",
        headerSort: false,
      },
    ];
    if (
      this.globalService.isAccessible(ActionConstant.EDIT) ||
      this.globalService.isAccessible(ActionConstant.DELETE)
    ) {
      this.relationColumnConfig.push({
        title: "",
        field: "option",
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),//will used for row-wise condition
        hozAlign: "center",
        headerSort: false,
      });
    }
  }

  hideUser(userId: any) {
    this.filteredUserTableData = this.filteredUserTableData.filter((item: any) => {
      return item.id != userId;
    });
  }

  hideAccount(userId: any) {
    this.filteredAccountTableData = this.filteredAccountTableData.filter((item: any) => {
      return item.id != userId;
    });
  }

  hideRelation(userId: any) {
    this.filteredRelationTableData = this.filteredRelationTableData.filter((item: any) => {
      return item.id != userId;
    });
  }

  hideOccasionType(userId: any) {
    this.filteredOccasionTypeTableData = this.filteredOccasionTypeTableData.filter((item: any) => {
      return item.id != userId;
    });
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

  deleteItem(config:string,id:string){

  }


}
