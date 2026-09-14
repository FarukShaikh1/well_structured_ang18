import {
  Component,
  OnInit
} from "@angular/core";

import { ColumnDefinition } from "tabulator-tables";

import {
  ApplicationTableConstants,
  NavigationURLs
} from "../../../../utils/application-constants";

import { CacheService } from "../../../services/cache/cache.service";
import { GlobalService } from "../../../services/global/global.service";
import { LoaderService } from "../../../services/loader/loader.service";
import { TransactionService } from "../../../services/transaction/transaction.service";

import { TabulatorGridComponent } from "../../shared/tabulator-grid/tabulator-grid.component";

@Component({
  selector: "app-emergency-return-report",
  standalone: true,
  imports: [
    TabulatorGridComponent
  ],
  templateUrl:
    "./emergency-return-report.component.html",
  styleUrls: [
    "./emergency-return-report.component.scss"
  ]
})
export class EmergencyReturnReportComponent
  implements OnInit {

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

  constructor(
    private transactionService: TransactionService,
    private cacheService: CacheService,
    private loaderService: LoaderService,
    public globalService: GlobalService
  ) {}

  ngOnInit(): void {

    this.loadGrid();
  }

  loadGrid(): void {

    this.loaderService.showLoader(
      "Loading emergency/return report..."
    );

    const cached =
      this.cacheService.get<any[]>(
        NavigationURLs.EMERGENCY_RETURN_REPORT
      );

    if (cached) {

      this.tableData = cached;

      this.filteredTableData =
        [...cached];

      this.loadColumnConfiguration();

      this.loaderService.hideLoader();

      return;
    }

    this.transactionService
      .getEmergencyReturnReportList()
      .subscribe({

        next: (res: any) => {

          this.tableData =
            res?.data ?? [];

          this.filteredTableData =
            [...this.tableData];

          this.cacheService.set(
            NavigationURLs.EMERGENCY_RETURN_REPORT,
            this.tableData
          );

          this.loadColumnConfiguration();

          this.loaderService.hideLoader();
        },

        error: (error: any) => {

          console.error(
            "Emergency/return report error:",
            error
          );

          this.loaderService.hideLoader();
        }
      });
  }

  refreshData(): void {

    this.cacheService.clear(
      NavigationURLs.EMERGENCY_RETURN_REPORT
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
        headerFilter: "input"
      },

      {
        title: "TakenAmount",
        field: "takenAmount",
        sorter: "alphanum",
        formatter:
          this.amountColorFormatter.bind(this),
        minWidth: 120,
        bottomCalc: "sum",
        headerFilter: "input"
      },

      {
        title: "GivenAmount",
        field: "givenAmount",
        sorter: "alphanum",
        formatter:
          this.amountColorFormatter.bind(this),
        minWidth: 120,
        bottomCalc: "sum",
        headerFilter: "input"
      },

      {
        title: "TotalAmount",
        field: "totalAmount",
        sorter: "alphanum",
        formatter:
          this.amountColorFormatter.bind(this),
        minWidth: 120,
        bottomCalc: "sum",
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