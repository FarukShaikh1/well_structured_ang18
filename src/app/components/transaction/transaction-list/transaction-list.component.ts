import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";

import { ColumnDefinition } from "tabulator-tables";

import {
  ApplicationConstantHtml,
  ApplicationModules,
  ApplicationTableConstants,
  NavigationURLs
} from "../../../../utils/application-constants";


import { ExpenseFilterRequest } from "../../../interfaces/expense-filter-request";

import { CacheService } from "../../../services/cache/cache.service";
import { GlobalService } from "../../../services/global/global.service";
import { LoaderService } from "../../../services/loader/loader.service";
import { TransactionService } from "../../../services/transaction/transaction.service";

import { TabulatorGridComponent } from "../../shared/tabulator-grid/tabulator-grid.component";

import { TransactionFilter } from "./../../../interfaces/transaction-filter.model";
import { ModulePermission } from "../../../interfaces/module-permission";

@Component({
  selector: "app-transaction-list",
  standalone: true,
  imports: [
    TabulatorGridComponent
  ],
  templateUrl: "./transaction-list.component.html",
  styleUrls: ["./transaction-list.component.scss"]
})
export class TransactionListComponent
  implements OnInit, OnChanges {

  @Input() filter!: TransactionFilter;

  @Input() allowAdd = true;

  @Output() openTransaction = new EventEmitter<string>();

  @Output() deleteTransactionEvent = new EventEmitter<string>();

  tableData: any[] = [];
  filteredTableData: any[] = [];
  columnConfig: ColumnDefinition[] = [];
  filterColumns: ColumnDefinition[] = [];
  paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  allowCSVExport = true;
  allowPrint = true;
  allowRefresh = true;
  allowColumnFilters = true;
  expensePermissions: ModulePermission = { view: false, add: false, edit: false, delete: false, download: false, upload: false, approve: false, reject: false };

  private initialized = false;
  constructor(
    private transactionService: TransactionService,
    private cacheService: CacheService,
    private loaderService: LoaderService,
    public globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.expensePermissions = this.globalService.getModulePermission(ApplicationModules.DAY);
    this.initialized = true;
    this.loadGrid();
    this.globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.EXPENSES) {
        this.loadGrid();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.initialized &&
      changes["filter"] &&
      !changes["filter"].firstChange
    ) {
      this.applyFilters();
    }
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
      } else {
        const globalMenu = document.getElementById('globalDropdownMenu');
        if (globalMenu) globalMenu.remove();
      }
    });
  }

  generateOptionsMenu(rowData: Record<string, any>) {
    const menu = [];
    if (this.expensePermissions.edit) {
      menu.push({
        label: ApplicationConstantHtml.EDIT_LABLE,
        action: () => {
          this.editTransaction(rowData['transactionGroupId']);
        },
      });
    }
    if (this.expensePermissions.delete) {
      menu.push({
        label: ApplicationConstantHtml.DELETE_LABLE,
        action: () => {
          this.deleteTransaction(rowData['id']);
        },
      });
    }
    return menu;
  }

  loadGrid(): void {

    this.loaderService.showLoader(
      "Loading transactions..."
    );

    const cachedData =
      this.cacheService.get<any[]>(
        NavigationURLs.EXPENSE_LIST
      );

    if (cachedData) {

      this.tableData = cachedData;

      this.filteredTableData =
        [...cachedData];

      this.loadColumnConfiguration();


      this.applyFilters();
      this.loaderService.hideLoader();

      return;
    }

    const request:
      ExpenseFilterRequest = {
      fromDate: this.filter.fromDate,
      toDate: this.filter.toDate,
      minAmount: this.filter.minAmount ?? 0,
      maxAmount: this.filter.maxAmount ?? 0,
      sourceOrReason:
        this.filter.sourceOrReason ?? ""
    };

    this.transactionService
      .getTransactionList(request)
      .subscribe({

        next: (res: any) => {
          this.tableData = res?.data ?? [];
          this.filteredTableData = [...this.tableData];
          this.cacheService.set(NavigationURLs.EXPENSE_LIST, this.tableData);
          this.loadColumnConfiguration();
          this.loaderService.hideLoader();
          this.applyFilters();
        },

        error: (error: any) => {
          console.error("Transaction list error:", error);
          this.loaderService.hideLoader();
        }
      });
  }

  applyFilters(): void {
    const search = this.filter?.sourceOrReason?.toLowerCase() ?? "";
    const min = Number(this.filter?.minAmount) || 0;
    const max = Number(this.filter?.maxAmount) || 0;
    this.filteredTableData = this.tableData.filter((item: any) => {
      const source = item.sourceOrReason?.toLowerCase() ?? "";
      const category = item.subCategoryName?.toLowerCase() ?? "";
      const description = item.description?.toLowerCase() ?? "";
      const textMatch = !search || source.includes(search) || category.includes(search) || description.includes(search);
      const expense = Number(item.expense) || 0;
      const income = Number(item.income) || 0;
      const minMatch = min === 0 || (expense !== 0 && Math.abs(expense) >= min) || (income !== 0 && Math.abs(income) >= min);
      const maxMatch = max === 0 || (expense !== 0 && Math.abs(expense) <= max) || (income !== 0 && Math.abs(income) <= max);
      return (textMatch && minMatch && maxMatch);
    });
  }

  refreshData(): void {
    this.cacheService.clear(NavigationURLs.EXPENSE_LIST);
    this.loadGrid();
  }

  addTransaction(): void {
    this.openTransaction.emit("");
  }

  editTransaction(transactionGroupId: string): void {
    this.openTransaction.emit(transactionGroupId);
  }

  deleteTransaction(transactionGroupId: string): void {
    this.deleteTransactionEvent.emit(transactionGroupId);
  }

  loadColumnConfiguration(): void {
    this.columnConfig = [
      {
        title: "Transaction Date",
        field: "transactionDate",
        sorter: "alphanum",
        formatter:
          this.dateFormatter.bind(this),
        minWidth: 120
      },

      {
        title: "Category",
        field: "subCategoryName",
        sorter: "alphanum",
        minWidth: 200,
        headerFilter: "input",
        headerFilterPlaceholder:
          "Search category"
      },

      {
        title: "Get From/Paid To",
        field: "sourceOrReason",
        sorter: "alphanum",
        formatter:
          this.getColorForText.bind(this),
        minWidth: 200,
        headerFilter: "input",
        headerFilterPlaceholder:
          "Search source or reason"
      },

      {
        title: "Description",
        field: "description",
        sorter: "alphanum",
        minWidth: 400,
        headerFilter: "input",
        headerFilterPlaceholder:
          "Search description"
      },

      {
        title: "Transaction By",
        field: "accountName",
        sorter: "alphanum",
        minWidth: 150,
        headerFilter: "input",
        headerFilterPlaceholder:
          "Search account"
      },

      {
        title: "Debit",
        field: "expense",
        sorter: "alphanum",
        formatter:
          this.debitAmountColorFormatter.bind(this),
        bottomCalc: "sum",
        bottomCalcFormatter:
          this.debitAmountColorFormatter.bind(this),
        minWidth: 120,
        headerFilter: "number",
        headerFilterPlaceholder:
          "Search debited amount"
      },

      {
        title: "Credit",
        field: "income",
        sorter: "alphanum",
        formatter:
          this.amountColorFormatter.bind(this),
        bottomCalc: "sum",
        bottomCalcFormatter:
          this.amountColorFormatter.bind(this),
        minWidth: 120,
        headerFilter: "number",
        headerFilterPlaceholder:
          "Search credited amount"
      },

      {
        title: "",
        field: "",
        maxWidth: 70,
        formatter:
          this.globalService.hidebuttonFormatter.bind(
            this.globalService
          ),
        cellClick: (_e, cell) => {

          const id = cell.getRow().getData()["transactionGroupId"];
          this.filteredTableData = this.filteredTableData.filter(item => item.transactionGroupId != id);
        },
        headerSort: false,
        print: false
      }
    ];

    this.columnConfig.push({
      title: "",
      field: "option",
      formatter: this.globalService.threeDotsFormatter.bind(this),
      hozAlign: "center",
      headerSort: false,
      minWidth: 70,
      maxWidth: 70,
      print: false,
    });
  }

  dateFormatter(cell: any): string {
    const field = cell.getColumn().getField();
    const data = cell.getRow().getData();
    const value = data[field];

    if (!value) {
      return "";
    }

    return `
      <span>
        ${new Intl.DateTimeFormat(
      "en-IN"
    ).format(new Date(value))}
      </span>
    `;
  }

  amountColorFormatter(cell: any): string {
    const value = Number(cell.getValue()) || 0;

    const formatted =
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(value);

    if (value > 0) {

      return `
        <span style="
          color:#129D0A;
          font-weight:bold">
          ${formatted}
        </span>
      `;
    }

    if (value < 0) {

      return `
        <span style="
          color:#FF0000;
          font-weight:bold">
          ${formatted}
        </span>
      `;
    }

    return "";
  }

  debitAmountColorFormatter(cell: any): string {

    const value = Number(cell.getValue()) || 0;

    if (value === 0) {
      return "";
    }

    const formatted =
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(value);

    return `
      <span style="
        color:#FF0000;
        font-weight:bold">
        ${formatted}
      </span>
    `;
  }

  getColorForText(cell: any): string {

    const data = cell.getRow().getData();
    const purpose = data["purpose"]?.toLowerCase() ?? "";
    const source = data["sourceOrReason"] ?? "";
    if (purpose.includes("emergency")) {
      return `
        <span style="
          color:var(--danger-color);
          font-weight:bold">
          ${source}
        </span>
      `;
    }

    if (purpose.includes("return")) {
      return `
        <span style="
          color:var(--success-color);
          font-weight:bold">
          ${source}
        </span>
      `;
    }

    if (purpose.includes("recharge")) {
      return `
        <span style="
          color:var(--theme-accent-orange);
          font-weight:bold">
          ${source}
        </span>
      `;
    }

    return `
      <span style="
        color:var(--theme-text);
        font-weight:bold">
        ${source}
      </span>
    `;
  }
}