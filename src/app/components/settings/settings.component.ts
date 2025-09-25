import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { ActionConstant, ApplicationConstantHtml, ApplicationModules, ApplicationTableConstants, Messages, UserConfig } from "../../../utils/application-constants";
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
  imports: [CommonModule, TabulatorGridComponent, ConfigurationDetailsComponent],
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
  UserConfig = UserConfig;
  isSuperAdmin = false;
  configOptionsMenu = [
    {
      label: ApplicationConstantHtml.EDIT_LABLE,
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
  currentConfig: string = '';

  constructor(
    private configurationService: ConfigurationService,
    public globalService: GlobalService,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    var data = this.localStorageService.getLoggedInUserData();
    var userId = data?.id;
    if (data.roleName !== 'Super Admin') {
      this.isSuperAdmin = true;
      this.loadUserGrid(userId)
    }
    else {
      this.isSuperAdmin = false;
      this.loadConfigGrid(userId, UserConfig.ACCOUNT);
      this.loadConfigGrid(userId, UserConfig.OCCASION_TYPE);
      this.loadConfigGrid(userId, UserConfig.RELATION);
    }
    this.globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.SETTINGS) {
        this.loadConfigGrid(userId, this.currentConfig);
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
          const accountRowData = this.accountTableData.find((row) => row['id'] == rowId);
          const relationRowData = this.relationTableData.find((row) => row['id'] == rowId);
          const OccasionTypeRowData = this.occasionTypeTableData.find((row) => row['id'] == rowId);
          if (accountRowData) {
            const menuOptions = this.generateOptionsMenu(accountRowData, UserConfig.ACCOUNT);
            this.globalService.showGlobalDropdownMenu(button, menuOptions);
          }
          else if (relationRowData) {
            const menuOptions = this.generateOptionsMenu(relationRowData, UserConfig.RELATION);
            this.globalService.showGlobalDropdownMenu(button, menuOptions);
          }
          else if (OccasionTypeRowData) {
            const menuOptions = this.generateOptionsMenu(OccasionTypeRowData, UserConfig.OCCASION_TYPE);
            this.globalService.showGlobalDropdownMenu(button, menuOptions);
          }
        }
        event.stopPropagation();
      } else { 
        const globalMenu = document.getElementById('globalDropdownMenu');
        if (globalMenu) globalMenu.remove();
      }
    });
  }

  generateOptionsMenu(rowData: Record<string, any>, config: string) {
    const menu = [];
    menu.push({
      label: ApplicationConstantHtml.CONFIG_EDIT_LABLE,
      action: () => {
        this.openDetailPopup(rowData['id'], config);
      },
    });
    menu.push({
      label: ApplicationConstantHtml.DEACTIVATE_LABLE,
      action: () => {
        this.deactivateItem(rowData['id'], config);
      },
    });

    if (!rowData['isUsed']) {
      menu.push({
        label: ApplicationConstantHtml.DELETE_LABLE,
        action: () => {
          this.deleteItem(rowData['id'], config);
        },
      });
    }
    return menu;
  }

  openDetailPopup(id: string, config: string) {
    this.currentConfig = config;
    this.configDetailsComponent.openDetailsPopup(id, config);
  }

  loadConfigGrid(userId: string, config: string) {
    this.accountColumnConfiguration();
    this.relationColumnConfiguration();
    this.occasionTypeColumnConfiguration();
    this.configurationService.getConfigList(userId, config).subscribe({
      next: (result: any) => {
        if (config === UserConfig.ACCOUNT) {
          this.filteredAccountTableData = result.data;
          this.accountTableData = result.data;
        }
        else if (config === UserConfig.RELATION) {
          this.filteredRelationTableData = result.data;
          this.relationTableData = result.data;
        }
        else if (config === UserConfig.OCCASION_TYPE) {
          this.filteredOccasionTypeTableData = result.data;
          this.occasionTypeTableData = result.data;
        }
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
          this.filteredUserTableData = result.data;
          this.userTableData = result.data;
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
      {
        title: "",
        field: "option",
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),
        hozAlign: "center",
        headerSort: false,
      }
    ];
  }

  accountColumnConfiguration() {
    this.accountColumnConfig = [
      {
        title: 'Account Name',
        field: 'configurationName',
        sorter: 'string',
      },
      { title: 'Description', field: 'description', sorter: 'string' },
      {
        title: "Display Order",
        field: "displayOrder",
        sorter: "alphanum",
      },
      {
        title: 'Status',
        field: 'isActive',
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
        title: "",
        field: "option",
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),
        hozAlign: "center",
        headerSort: false,
      }
    ];
  }

  occasionTypeColumnConfiguration() {
    this.occasionTypeColumnConfig = [
      {
        title: 'OccasionType Name',
        field: 'configurationName',
        sorter: 'string',
      },
      { title: 'Description', field: 'description', sorter: 'string' },
      {
        title: "Display Order",
        field: "displayOrder",
        sorter: "alphanum",
      },
      {
        title: 'Statussss',
        field: 'isActive',
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
      {
        title: "",
        field: "option",
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),
        hozAlign: "center",
        headerSort: false,
      }

    ];
  }

  relationColumnConfiguration() {
    this.relationColumnConfig = [
      {
        title: 'RelationType Name',
        field: 'configurationName',
        sorter: 'string',
      },
      { title: 'Description', field: 'description', sorter: 'string' },
      {
        title: "Display Order",
        field: "displayOrder",
        sorter: "alphanum",
      },
      {
        title: 'Status',
        field: 'isActive',
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
      {
        title: "",
        field: "option",
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),
        hozAlign: "center",
        headerSort: false,
      }
    ];
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

  deleteItem(id: string, config: string) {

  }

  deactivateItem(id: string, config: string) {
    this.configurationService.deactivateConfiguration(id, config).subscribe({
      next: (result: any) => {
        if (config === UserConfig.ACCOUNT) {
          this.filteredAccountTableData = result.data;
          this.accountTableData = result.data;
        }
        else if (config === UserConfig.RELATION) {
          this.filteredRelationTableData = result.data;
          this.relationTableData = result.data;
        }
        else if (config === UserConfig.OCCASION_TYPE) {
          this.filteredOccasionTypeTableData = result.data;
          this.occasionTypeTableData = result.data;
        }
        this.toaster.showMessage("Record deativated successfully.", "success");
      },
      error: (error: any) => {
        console.error('Error fetching user list', error);
      },
    });

  }


}
