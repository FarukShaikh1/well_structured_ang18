import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";

import { ColumnDefinition } from "tabulator-tables";

import {
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

@Component({
  selector: "app-transaction-balance",
  standalone: true,
  imports: [
    TabulatorGridComponent
  ],
  templateUrl: "./transaction-balance.component.html",
  styleUrls: ["./transaction-balance.component.scss"]
})
export class TransactionBalanceComponent
  implements OnInit, OnChanges {

  @Input()
  filter!: TransactionFilter;

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

  constructor(
    private transactionService: TransactionService,
    private cacheService: CacheService,
    private loaderService: LoaderService,
    public globalService: GlobalService
  ) { }

  ngOnInit(): void {

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

  loadGrid(): void {

    this.loaderService.showLoader(
      "Loading balance summary..."
    );

    const cached =
      this.cacheService.get<any[]>(
        NavigationURLs.EXPENSE_BALANCE_LIST
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
      .getBalanceList(request)
      .subscribe({

        next: (res: any) => {

          this.tableData =
            res?.data ?? [];

          this.filteredTableData =
            [...this.tableData];

          this.cacheService.set(
            NavigationURLs.EXPENSE_BALANCE_LIST,
            this.tableData
          );

          this.cacheService.set(
            NavigationURLs.EXPENSE_BALANCE_LIST +
            "_AccountColumns",
            this.tableData[0]?.accountData
          );

          this.loadColumnConfiguration();

          this.loaderService.hideLoader();

          this.applyFilters();
        },

        error: (error: any) => {

          console.error(
            "Balance summary error:",
            error
          );

          this.loaderService.hideLoader();
        }
      });
  }

  applyFilters(): void {

    const min =
      Number(this.filter?.minAmount) || 0;

    const max =
      Number(this.filter?.maxAmount) || 0;

    this.filteredTableData =
      this.tableData.filter((item: any) => {

        const values =
          item.accountData
            ? Object.values(item.accountData)
              .map((x: any) => Number(x))
              .filter(x => !isNaN(x))
            : [];

        const minMatch =
          min === 0 ||
          values.some(
            x =>
              x !== 0 &&
              Math.abs(x) >= min
          );

        const maxMatch =
          max === 0 ||
          values.some(
            x =>
              x !== 0 &&
              Math.abs(x) <= max
          );

        return minMatch && maxMatch;
      });
  }

  refreshData(): void {

    this.cacheService.clear(
      NavigationURLs.EXPENSE_BALANCE_LIST
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
      }
    ];

    const accountColumns =
      this.cacheService.get<any>(
        NavigationURLs.EXPENSE_BALANCE_LIST +
        "_AccountColumns"
      );

    if (accountColumns) {

      for (
        const key of Object.keys(accountColumns)
      ) {

        if (
          key.toLowerCase()
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

      maxWidth: 70,

      formatter:
        this.globalService.hidebuttonFormatter.bind(
          this.globalService
        ),

      cellClick: (_e, cell) => {

        const date =
          cell.getRow()
            .getData()["transactionDate"];

        this.filteredTableData =
          this.filteredTableData.filter(
            item =>
              item.transactionDate != date
          );
      },

      headerSort: false,
      print: false
    });
  }

  dateFormatter(cell: any): string {

    const field =
      cell.getColumn().getField();

    const value =
      cell.getRow().getData()[field];

    if (!value) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "en-IN"
    ).format(new Date(value));
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
      value === undefined
    ) {
      return "";
    }

    if (Number(value) === 0) {
      return "";
    }

    const formatted =
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(Number(value));

    return `
      <span style="
        color:${Number(value) > 0
        ? "var(--success-color)"
        : "var(--danger-color)"};
        font-weight:bold">
        ${formatted}
      </span>
    `;
  }
}