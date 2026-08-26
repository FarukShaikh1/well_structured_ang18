import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { ActionConstant, ApplicationConstantHtml, ApplicationModules, ApplicationTableConstants, UIStrings, UserConfig } from "../../../utils/application-constants";
import { CacheService } from "../../services/cache/cache.service";
import { ConfigurationService } from "../../services/configuration/configuration.service";
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from "../../services/loader/loader.service";
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { UserService } from "../../services/user/user.service";
import { ConfigurationDetailsComponent } from '../configuration-details/configuration-details.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TabulatorGridComponent, ConfigurationDetailsComponent, ConfirmationDialogComponent, ToasterComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
  @ViewChild(ConfigurationDetailsComponent) configDetailsComponent!: ConfigurationDetailsComponent;
  @ViewChild('searchInput') searchInput!: ElementRef;
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = true;
  public allowPrint = true;
  public filterColumns: ColumnDefinition[] = [];
  searchText: string = '';
  noDataMessage = UIStrings.COMMON.NO_DATA;
  noMatchingDataMessage = UIStrings.COMMON.NO_DATA;
  isAccountGridLoading: boolean = false;
  isOccasionTypeGridLoading: boolean = false;
  isRelationGridLoading: boolean = false;
  isTransactionCategoryGridLoading: boolean = false;
  isUserGridLoading: boolean = false;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;

  accountColumnConfig: ColumnDefinition[] = [];
  occasionTypeColumnConfig: ColumnDefinition[] = [];
  relationColumnConfig: ColumnDefinition[] = [];
  transactionCategoryColumnConfig: ColumnDefinition[] = [];

  filteredUserTableData: Record<string, unknown>[] = [];
  filteredAccountTableData: Record<string, unknown>[] = [];
  filteredOccasionTypeTableData: Record<string, unknown>[] = [];
  filteredRelationTableData: Record<string, unknown>[] = [];
  filteredTransactionCategoryTableData: Record<string, unknown>[] = [];
  ActionConstant = ActionConstant;
  userTableData: Record<string, unknown>[] = [];
  accountTableData: Record<string, unknown>[] = [];
  occasionTypeTableData: Record<string, unknown>[] = [];
  relationTableData: Record<string, unknown>[] = [];
  transactionCategoryTableData: Record<string, unknown>[] = [];
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
  userList: any;
  selectedId: string = '';
  selectedConfig: string = '';
  selectedUserId: string = '';

  constructor(
    private configurationService: ConfigurationService,
    public globalService: GlobalService,
    private userService: UserService,
    private cacheService: CacheService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    var data = this.localStorageService.getLoggedInUserData();
    this.selectedUserId = data?.id;
    if (data.roleName === 'Super Admin') {
      this.isSuperAdmin = true;
      this.getUserList();
    }
    else {
      this.isSuperAdmin = false;
    }
    this.loadConfigGrid(this.selectedUserId, UserConfig.ACCOUNT);
    this.loadConfigGrid(this.selectedUserId, UserConfig.TRANSACTION_CATEGORY);
    this.loadConfigGrid(this.selectedUserId, UserConfig.OCCASION_TYPE);
    this.loadConfigGrid(this.selectedUserId, UserConfig.RELATION);

    this.globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.SETTINGS) {
        this.loadConfigGrid(this.selectedUserId, this.currentConfig);
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
          const categoryRowData = this.transactionCategoryTableData.find((row) => row['id'] == rowId);
          const relationRowData = this.relationTableData.find((row) => row['id'] == rowId);
          const OccasionTypeRowData = this.occasionTypeTableData.find((row) => row['id'] == rowId);
          if (accountRowData) {
            const menuOptions = this.generateOptionsMenu(accountRowData, UserConfig.ACCOUNT);
            this.globalService.showGlobalDropdownMenu(button, menuOptions);
          }
          else if (categoryRowData) {
            const menuOptions = this.generateOptionsMenu(categoryRowData, UserConfig.TRANSACTION_CATEGORY);
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
    this.transactionCategoryColumnConfiguration();
    this.relationColumnConfiguration();
    this.occasionTypeColumnConfiguration();

    if (config === UserConfig.ACCOUNT) {
      this.isAccountGridLoading = true;
    } else if (config === UserConfig.TRANSACTION_CATEGORY) {
      this.isTransactionCategoryGridLoading = true;
    } else if (config === UserConfig.RELATION) {
      this.isRelationGridLoading = true;
    } else if (config === UserConfig.OCCASION_TYPE) {
      this.isOccasionTypeGridLoading = true;
    }

    // ✅ 1. Check cache first
    const cachedData = this.cacheService.get<any[]>(config);
    if (cachedData) {
      if (config === UserConfig.ACCOUNT) {
        this.filteredAccountTableData = cachedData;
        this.accountTableData = cachedData;
        this.isAccountGridLoading = false;
      }
      else if (config === UserConfig.TRANSACTION_CATEGORY) {
        this.filteredTransactionCategoryTableData = cachedData;
        this.transactionCategoryTableData = cachedData;
        this.isTransactionCategoryGridLoading = false;
      }
      else if (config === UserConfig.RELATION) {
        this.filteredRelationTableData = cachedData;
        this.relationTableData = cachedData;
        this.isRelationGridLoading = false;
      }
      else if (config === UserConfig.OCCASION_TYPE) {
        this.filteredOccasionTypeTableData = cachedData;
        this.occasionTypeTableData = cachedData;
        this.isOccasionTypeGridLoading = false;
      }
      return;
    }
    this.configurationService.getConfigList(userId, config).subscribe({
      next: (result: any) => {
        this.cacheService.set(config, result.data);

        if (config === UserConfig.ACCOUNT) {
          this.filteredAccountTableData = result.data;
          this.accountTableData = result.data;
          this.isAccountGridLoading = false;
        }
        else if (config === UserConfig.TRANSACTION_CATEGORY) {
          this.filteredTransactionCategoryTableData = result.data;
          this.transactionCategoryTableData = result.data;
          this.isTransactionCategoryGridLoading = false;
        }
        else if (config === UserConfig.RELATION) {
          this.filteredRelationTableData = result.data;
          this.relationTableData = result.data;
          this.isRelationGridLoading = false;
        }
        else if (config === UserConfig.OCCASION_TYPE) {
          this.filteredOccasionTypeTableData = result.data;
          this.occasionTypeTableData = result.data;
          this.isOccasionTypeGridLoading = false;
        }
      },
      error: (error: any) => {
        if (config === UserConfig.ACCOUNT) {
          this.isAccountGridLoading = false;
        } else if (config === UserConfig.TRANSACTION_CATEGORY) {
          this.isTransactionCategoryGridLoading = false;
        } else if (config === UserConfig.RELATION) {
          this.isRelationGridLoading = false;
        } else if (config === UserConfig.OCCASION_TYPE) {
          this.isOccasionTypeGridLoading = false;
        }
      },
    });
  }

  accountColumnConfiguration() {
    this.accountColumnConfig = [
      {
        title: UIStrings.COLUMN_TITLES.ACCOUNT_NAME,
        field: 'configurationName',
        sorter: 'string',
      },
      { title: UIStrings.COLUMN_TITLES.DESCRIPTION, field: 'description', sorter: 'string' },
      {
        title: UIStrings.COLUMN_TITLES.DISPLAY_ORDER,
        field: "displayOrder",
        sorter: "alphanum",
      },
      {
        title: UIStrings.COLUMN_TITLES.STATUS,
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

  transactionCategoryColumnConfiguration() {
    this.transactionCategoryColumnConfig = [
      {
        title: UIStrings.COLUMN_TITLES.TRANSACTION_CATEGORY_NAME,
        field: 'configurationName',
        sorter: 'string',
      },
      { title: UIStrings.COLUMN_TITLES.DESCRIPTION, field: 'description', sorter: 'string' },
      {
        title: UIStrings.COLUMN_TITLES.DISPLAY_ORDER,
        field: "displayOrder",
        sorter: "alphanum",
      },
      {
        title: UIStrings.COLUMN_TITLES.STATUS,
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
          this.hideTransactionCategory(id);
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
        title: UIStrings.COLUMN_TITLES.OCCASION_TYPE_NAME,
        field: 'configurationName',
        sorter: 'string',
      },
      { title: UIStrings.COLUMN_TITLES.DESCRIPTION, field: 'description', sorter: 'string' },
      {
        title: UIStrings.COLUMN_TITLES.DISPLAY_ORDER,
        field: "displayOrder",
        sorter: "alphanum",
      },
      {
        title: UIStrings.COLUMN_TITLES.STATUS,
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
        title: UIStrings.COLUMN_TITLES.RELATION_TYPE_NAME,
        field: 'configurationName',
        sorter: 'string',
      },
      { title: UIStrings.COLUMN_TITLES.DESCRIPTION, field: 'description', sorter: 'string' },
      {
        title: UIStrings.COLUMN_TITLES.DISPLAY_ORDER,
        field: "displayOrder",
        sorter: "alphanum",
      },
      {
        title: UIStrings.COLUMN_TITLES.STATUS,
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

  hideTransactionCategory(userId: any) {
    this.filteredTransactionCategoryTableData = this.filteredTransactionCategoryTableData.filter((item: any) => {
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

  refreshData() {
    localStorage.removeItem(UserConfig.ACCOUNT);
    localStorage.removeItem(UserConfig.TRANSACTION_CATEGORY);
    localStorage.removeItem(UserConfig.OCCASION_TYPE);
    localStorage.removeItem(UserConfig.RELATION);
    this.loadConfigGrid(this.selectedUserId, UserConfig.ACCOUNT);
    this.loadConfigGrid(this.selectedUserId, UserConfig.OCCASION_TYPE);
    this.loadConfigGrid(this.selectedUserId, UserConfig.RELATION);
    this.loadConfigGrid(this.selectedUserId, UserConfig.TRANSACTION_CATEGORY);
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
    if (id) {
      this.selectedId = id;
      this.selectedConfig = config;
      this.confirmationDialog.openConfirmationPopup(
        "Confirmation",
        "Are you sure you want to delete? This action cannot be undone."
      );
    }
  }

  handleConfirmResult(isConfirmed: boolean) {
    if (isConfirmed) {
      this.loaderService.showLoader('Deleting ...');
      this.configurationService.deleteConfiguration(this.selectedId, this.selectedConfig).subscribe({
        next: (res: any) => {
          this.toaster.showMessage(res.message, res.success ? "success" : "error");
          this.loaderService.hideLoader();
          if (res.success) {
            localStorage.removeItem(this.selectedConfig);
            this.loadConfigGrid(this.selectedUserId, this.selectedConfig);
          }
        },
        error: (error: any) => {
          console.error("error : ", error);
          this.loaderService.hideLoader();
        },
      });
    }
  }


  deactivateItem(id: string, config: string) {
    this.configurationService.deactivateConfiguration(id, config).subscribe({
      next: (result: any) => {
        this.loadConfigGrid(this.selectedUserId, config);
        this.toaster.showMessage("Record deativated successfully.", "success");
      },
      error: (error: any) => {
        console.error('Error fetching user list', error);
      },
    });

  }

  getUserList() {
    this.loaderService.showLoader();
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

  changeUser(event: Event) {
    localStorage.removeItem(UserConfig.ACCOUNT);
    localStorage.removeItem(UserConfig.TRANSACTION_CATEGORY);
    localStorage.removeItem(UserConfig.OCCASION_TYPE);
    localStorage.removeItem(UserConfig.RELATION);
    const select = event.target as HTMLSelectElement;
    this.selectedUserId = select.value;
    if (!this.selectedUserId) {
    }
    else {
      this.loadConfigGrid(this.selectedUserId, UserConfig.ACCOUNT);
      this.loadConfigGrid(this.selectedUserId, UserConfig.TRANSACTION_CATEGORY);
      this.loadConfigGrid(this.selectedUserId, UserConfig.OCCASION_TYPE);
      this.loadConfigGrid(this.selectedUserId, UserConfig.RELATION);
    }
  }
}
