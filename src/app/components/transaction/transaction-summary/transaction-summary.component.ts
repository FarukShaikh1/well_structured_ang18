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
  selector: "app-transaction-summary",
  standalone: true,
  imports: [
    TabulatorGridComponent
  ],
  templateUrl: "./transaction-summary.component.html",
  styleUrls: ["./transaction-summary.component.scss"]
})
export class TransactionSummaryComponent
  implements OnInit, OnChanges {

  @Input()
  filter!: TransactionFilter;
  @Input()
  allowAdd = true;

  @Output()
  openTransaction =
    new EventEmitter<string>();

  @Output()
  deleteTransactionEvent =
    new EventEmitter<string>();

  tableData: any[] = [];

  filteredTableData: any[] = [];

  columnConfig: ColumnDefinition[] = [];

  filterColumns: ColumnDefinition[] = [];

  paginationSize =
    ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;

  allowCSVExport = true;
  allowPrint = true;
  allowRefresh = true;
  allowColumnFilters = true;

  private initialized = false;
  expensePermissions: ModulePermission = { view: false, add: false, edit: false, delete: false, download: false, upload: false, approve: false, reject: false };

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
      "Loading transaction summary..."
    );

    const cached =
      this.cacheService.get<any[]>(
        NavigationURLs.EXPENSE_SUMMARY_LIST
      );

    if (cached) {

      this.tableData = cached;

      this.filteredTableData =
        [...cached];

      this.loadColumnConfiguration();

      this.loaderService.hideLoader();

      this.applyFilters();

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
      .getTransactionSummaryList(request)
      .subscribe({

        next: (res: any) => {

          this.tableData =
            res?.data ?? [];

          this.filteredTableData =
            [...this.tableData];

          const accountData =
            this.tableData[0]?.accountData;

          this.cacheService.set(
            NavigationURLs.EXPENSE_SUMMARY_LIST,
            this.tableData
          );

          this.cacheService.set(
            NavigationURLs.EXPENSE_SUMMARY_LIST +
            "_AccountColumns",
            accountData
          );

          this.loadColumnConfiguration();

          this.loaderService.hideLoader();

          this.applyFilters();
        },

        error: (error: any) => {

          console.error(
            "Transaction summary error:",
            error
          );

          this.loaderService.hideLoader();
        }
      });
  }

  applyFilters(): void {

    const search =
      this.filter?.sourceOrReason
        ?.toLowerCase() ?? "";

    const min =
      Number(this.filter?.minAmount) || 0;

    const max =
      Number(this.filter?.maxAmount) || 0;

    this.filteredTableData =
      this.tableData.filter((item: any) => {
        const textMatch =
          !search ||
          item.sourceOrReason
            ?.toLowerCase()
            .includes(search) ||
          item.subCategoryName
            ?.toLowerCase()
            .includes(search) ||
          item.description
            ?.toLowerCase()
            .includes(search);

        const accountValues =
          item.accountData
            ? Object.values(item.accountData)
              .map((x: any) => Number(x))
              .filter(x => !isNaN(x))
            : [];

        const minMatch =
          min === 0 ||
          accountValues.some(
            x =>
              x !== 0 &&
              Math.abs(x) >= min
          );

        const maxMatch =
          max === 0 ||
          accountValues.some(
            x =>
              x !== 0 &&
              Math.abs(x) <= max
          );

        return (
          textMatch &&
          minMatch &&
          maxMatch
        );
      });
  }

  refreshData(): void {

    this.cacheService.clear(
      NavigationURLs.EXPENSE_SUMMARY_LIST
    );

    this.loadGrid();
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
        headerFilter: "input"
      },

      {
        title: "Get From/Paid To",
        field: "sourceOrReason",
        sorter: "alphanum",
        minWidth: 150,
        headerFilter: "input"
      },

      {
        title: "Description",
        field: "description",
        sorter: "alphanum",
        minWidth: 200,
        headerFilter: "input"
      }
    ];

    const accountColumns =
      this.cacheService.get<any>(
        NavigationURLs.EXPENSE_SUMMARY_LIST +
        "_AccountColumns"
      );

    if (accountColumns) {

      for (
        const key of Object.keys(accountColumns)
      ) {

        if (
          key
            .toLowerCase()
            .includes("category")
        ) {
          continue;
        }

        this.columnConfig.push({

          title: key,

          field:
            `accountData.${key}`,

          formatter:
            this.summaryAmountColorFormatter.bind(
              this
            ),

          hozAlign: "center",

          headerHozAlign: "center",

          cssClass: "amount-column",

          bottomCalc: "sum",

          bottomCalcFormatter:
            this.amountColorFormatter.bind(
              this
            ),

          minWidth: 120
        });
      }
    }

    this.columnConfig.push({
      title: "",
      field: "",
      minWidth: 50,
      maxWidth: 70,
      formatter: this.globalService.hidebuttonFormatter.bind(this.globalService),
      cellClick: (_e, cell) => {
        const id = cell.getRow().getData()["transactionGroupId"];
        this.filteredTableData = this.filteredTableData.filter(item => item.transactionGroupId != id);
      },
      headerSort: false,
      print: false
    });
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
    const value = cell.getRow().getData()[field];
    if (!value) {
      return "";
    }
    return new Intl.DateTimeFormat("en-IN").format(new Date(value));
  }

  amountColorFormatter(cell: any): string {

    const value =
      Number(cell.getValue()) || 0;

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
        color:${value > 0
        ? "var(--success-color)"
        : "var(--danger-color)"};
        font-weight:bold">
        ${formatted}
      </span>
    `;
  }

  summaryAmountColorFormatter(
    cell: any
  ): string {

    const value =
      cell.getValue();

    if (
      value === null ||
      value === undefined ||
      value === 0
    ) {
      return "";
    }

    const formatted =
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(Number(value));

    const field =
      cell.getColumn().getField();

    const data =
      cell.getRow().getData();

    const match =
      field.match(
        /accountData\.([^.]+)_Amount/i
      );

    if (match) {

      const category =
        data.accountData[
        `${match[1]}_Category`
        ];

      if (category === "Income") {

        return `
          <span style="
            color:var(--success-color);
            font-weight:bold">
            ${formatted}
          </span>
        `;
      }

      if (category === "Expense") {

        return `
          <span style="
            color:var(--danger-color);
            font-weight:bold">
            ${formatted}
          </span>
        `;
      }
    }

    if (Number(value) > 0) {

      return `
        <span style="
          color:var(--success-color);
          font-weight:bold">
          ${formatted}
        </span>
      `;
    }

    return `
      <span style="
        color:var(--danger-color);
        font-weight:bold">
        ${formatted}
      </span>
    `;
  }

  addTransaction(): void {
    this.openTransaction.emit("");
  }

  editTransaction(
    transactionGroupId: string
  ): void {

    this.openTransaction.emit(
      transactionGroupId
    );
  }

  deleteTransaction(
    transactionGroupId: string
  ): void {

    this.deleteTransactionEvent.emit(
      transactionGroupId
    );
  }


}