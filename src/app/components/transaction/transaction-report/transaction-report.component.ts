import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";

import { ColumnDefinition } from "tabulator-tables";

import {
  ApplicationConstants,
  ApplicationTableConstants,
  NavigationURLs
} from "../../../../utils/application-constants";

import { ExpenseFilterRequest } from "../../../interfaces/expense-filter-request";

import { CacheService } from "../../../services/cache/cache.service";
import { LoaderService } from "../../../services/loader/loader.service";
import { TransactionService } from "../../../services/transaction/transaction.service";
import { GlobalService } from "../../../services/global/global.service";

import { TabulatorGridComponent } from "../../shared/tabulator-grid/tabulator-grid.component";

import { TransactionPieChartComponent } from "../transaction-pie-chart/transaction-pie-chart.component";
import { TransactionReportChartComponent } from "../transaction-report-chart/transaction-report-chart.component";

import { TransactionFilter } from "./../../../interfaces/transaction-filter.model";

@Component({
  selector: "app-transaction-report",
  standalone: true,
  imports: [
    TabulatorGridComponent,
    TransactionPieChartComponent,
    TransactionReportChartComponent
  ],
  templateUrl: "./transaction-report.component.html",
  styleUrls: ["./transaction-report.component.scss"]
})
export class TransactionReportComponent
  implements OnInit, OnChanges {

  @Input()
  filter!: TransactionFilter;

  @Input()
  reportType =
    ApplicationConstants.REPORT_TYPE_SOURCE_WISE;

  transactionReports: any[] = [];

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
  ) {}

  ngOnInit(): void {

    this.initialized = true;

    this.loadGrid();
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
      "Loading transaction report..."
    );

    const cached =
      this.cacheService.get<any[]>(
        NavigationURLs.EXPENSE_REPORT
      );

    if (cached) {

      this.tableData = cached;

      this.filteredTableData =
        [...cached];

      this.transactionReports =
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
      .getTransactionReportList(request)
      .subscribe({

        next: (res: any) => {

          this.tableData =
            res?.data ?? [];

          this.filteredTableData =
            [...this.tableData];

          this.transactionReports =
            [...this.tableData];

          this.cacheService.set(
            NavigationURLs.EXPENSE_REPORT,
            this.tableData
          );

          this.loadColumnConfiguration();

          this.loaderService.hideLoader();

          this.applyFilters();
        },

        error: (error: any) => {

          console.error(
            "Transaction report error:",
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
          item.description
            ?.toLowerCase()
            .includes(search);

        const amounts = [
          item.givenAmount,
          item.totalAmount,
          item.takenAmount
        ]
          .map(x => Number(x))
          .filter(x => !isNaN(x));

        const minMatch =
          min === 0 ||
          amounts.some(
            x =>
              x !== 0 &&
              Math.abs(x) >= min
          );

        const maxMatch =
          max === 0 ||
          amounts.some(
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

    this.transactionReports =
      [...this.filteredTableData];
  }

  refreshData(): void {

    this.cacheService.clear(
      NavigationURLs.EXPENSE_REPORT
    );

    this.loadGrid();
  }

  loadColumnConfiguration(): void {

    this.columnConfig = [

      {
        title: "FirstDate",
        field: "firstDate",
        sorter: "alphanum",
        minWidth: 100,
        formatter:
          this.dateFormatter.bind(this)
      },

      {
        title: "LastDate",
        field: "lastDate",
        sorter: "alphanum",
        minWidth: 100,
        formatter:
          this.dateFormatter.bind(this)
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
        minWidth: 600,
        formatter: (cell: any) =>
          `<div class="text-wrap">
             ${cell.getValue() || ""}
           </div>`,
        cssClass:
          "description-column",
        headerFilter: "input"
      },

      {
        title: "TakenAmount",
        field: "takenAmount",
        sorter: "alphanum",
        formatter:
          this.amountColorFormatter.bind(this),
        hozAlign: "right",
        bottomCalc: "sum",
        minWidth: 120,
        headerFilter: "input"
      },

      {
        title: "GivenAmount",
        field: "givenAmount",
        sorter: "alphanum",
        formatter:
          this.amountColorFormatter.bind(this),
        hozAlign: "right",
        bottomCalc: "sum",
        minWidth: 120,
        headerFilter: "input"
      },

      {
        title: "TotalAmount",
        field: "totalAmount",
        sorter: "alphanum",
        formatter:
          this.amountColorFormatter.bind(this),
        hozAlign: "right",
        bottomCalc: "sum",
        minWidth: 120,
        headerFilter: "input"
      },

      {
        title: "",
        field: "",
        minWidth: 50,
        maxWidth: 70,
        formatter:
          this.globalService.hidebuttonFormatter.bind(
            this.globalService
          ),
        cellClick: (_e, cell) => {

          const source =
            cell.getRow()
              .getData()["sourceOrReason"];

          this.filteredTableData =
            this.filteredTableData.filter(
              item =>
                item.sourceOrReason != source
            );

          this.transactionReports =
            [...this.filteredTableData];
        },
        headerSort: false,
        print: false
      }
    ];
  }

  dateFormatter(cell: any): string {

    const value =
      cell.getValue();

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
}