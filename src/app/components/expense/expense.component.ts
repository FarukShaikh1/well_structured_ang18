import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import flatpickr from "flatpickr";
import { CellComponent, ColumnDefinition } from "tabulator-tables";
import {
  ApplicationConstants,
  ApplicationModules,
  ApplicationTableConstants,
  NavigationURLs,
} from "../../../utils/application-constants";
import { DateUtils } from "../../../utils/date-utils";
import { ExpenseService } from "../../services/expense/expense.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { ExpenseDetailsComponent } from "../expense-details/expense-details.component";
import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { ToasterComponent } from "../shared/toaster/toaster.component";
export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: "app-expense",
  standalone: true,
  imports: [
    CommonModule,
    TabulatorGridComponent,
    ExpenseDetailsComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: "./expense.component.html",
  providers: [DatePipe, DateUtils],
  styleUrls: ["./expense.component.scss"],
})
export class ExpenseComponent implements OnInit {
  @ViewChild("searchInput") searchInput!: ElementRef;
  @ViewChild("minInput") minInput!: any;
  @ViewChild("maxInput") maxInput!: any;
  @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(ExpenseDetailsComponent)
  expenseDetailsComponent!: ExpenseDetailsComponent;
  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;

  public tableData: Record<string, unknown>[] = [];
  public filteredTableData: Record<string, unknown>[] = [];
  public tableColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE; // Set default pagination size
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];

  lastExpenseDate: Date = new Date();

  fromDate = new Date();
  toDate = new Date();
  formattedFromDate: any;
  formattedToDate: any;
  sourceOrReason: string = "";
  minAmount: number = 0;
  maxAmount: number = 0;
  sourceOrReasonList: any;
  expenseId: string = "";

  optionsMenu = [
    {
      label: `<a class="dropdown-item btn-link"
              data-bs-toggle="modal" data-bs-target="#expenseDetailsPopup">
                  <i class="bi bi-pencil"></i>
                    &nbsp;Edit
                  </a>
                  `,
      action: (_e: any, cell: CellComponent) => {
        const expenseData = cell.getRow().getData();
        const expenseId = expenseData["expenseId"];
        this.expenseDetails(expenseId);
      },
    },
    {
      separator: true,
    },
    {
      label: `<a class="dropdown-item btn-link"
              data-bs-toggle="modal" data-bs-target="#confirmationPopup">
                  <i class="bi bi-trash"></i>
                    &nbsp;Delete
                  </a>
                  `,
      action: (_e: any, cell: CellComponent) => {
        const expenseData = cell.getRow().getData();
        const expenseId = expenseData["expenseId"];
        this.deleteExpense(expenseId);
      },
    },
  ];
  activeComponent: string = NavigationURLs.EXPENSE_LIST;
  reportLastDate = "";
  reportFirstDate = "";

  constructor(
    private expenseService: ExpenseService,
    public datePipe: DatePipe,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private dateUtil: DateUtils
  ) {}

  ngOnInit() {
    this.fromDate.setDate(this.toDate.getDate() - 30);
    this.ClearFilter();
    this.globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.EXPENSE) {
        this.LoadGrid();
      }
    });
    this.globalService.refreshList$.subscribe((listName: string) => {
      if (listName === ApplicationModules.EXPENSE) {
        this.applyFilters();
      }
    });
  }

  columnConfiguration() {
    if (this.activeComponent === NavigationURLs.EXPENSE_LIST) {
      this.tableColumnConfig = [
        {
          title: "Expense Date",
          field: "expenseDate",
          sorter: "alphanum",
          formatter: this.dateFormatter.bind(this),
        },
        {
          title: "Source/Reason",
          field: "sourceOrReason",
          sorter: "alphanum",
          formatter: this.getColorForText.bind(this),
        },
        {
          title: "Description",
          field: "description",
          sorter: "alphanum",
          width: 400,
        },
        {
          title: "ModeOfTransaction",
          field: "modeOfTransaction",
          sorter: "alphanum",
        },
        {
          title: "Debit",
          field: "debit",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          bottomCalc: "sum", // This will calculate the sum
          bottomCalcFormatter: this.amountColorFormatter.bind(this), // Optional: Format the sum (if it's a currency value)
          bottomCalcFormatterParams: { symbol: "", precision: 2 }, // Customize formatting
        },
        {
          title: "Credit",
          field: "credit",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          bottomCalc: "sum", // This will calculate the sum
          bottomCalcFormatter: this.amountColorFormatter.bind(this), // Optional: Format the sum (if it's a currency value)
          bottomCalcFormatterParams: { symbol: "", precision: 2 }, // Customize formatting
        },
        {
          title: "-",
          field: "-",
          maxWidth: 50,
          formatter: this.globalService.hidebuttonFormatter.bind(this),
          cellClick: (e, cell) => {
            const expenseId = cell.getRow().getData()["expenseId"];
            this.hideExpense(expenseId); // Call the hideExpense method
          },
        },
        {
          title: "",
          field: "",
          maxWidth: 50,
          formatter: (_cell) =>
            '<button class="action-buttons" title="More Actions" style="padding-right:100px;"><i class="bi bi-three-dots btn-link"></i></button>',
          clickMenu: this.optionsMenu,
          hozAlign: "left",
          headerSort: false,
        },
      ];
    } else if (this.activeComponent === NavigationURLs.EXPENSE_SUMMARY_LIST) {
      this.tableColumnConfig = [
        {
          title: "Expense Date",
          field: "expenseDate",
          sorter: "alphanum",
          formatter: this.dateFormatter.bind(this),
        },
        {
          title: "Source/Reason",
          field: "sourceOrReason",
          sorter: "alphanum",
        },
        {
          title: "Description",
          field: "description",
          sorter: "alphanum",
        },
        {
          title: "SBI Account",
          field: "sbiAccount",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          headerHozAlign: "right",
          hozAlign: "right",
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
          cssClass: "amount-column",
        },
        {
          title: "Cash Account",
          field: "cash",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          headerHozAlign: "right",
          hozAlign: "right",
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
          cssClass: "amount-column",
        },
        {
          title: "CBI Account",
          field: "cbiAccount",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          headerHozAlign: "right",
          hozAlign: "right",
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
          cssClass: "amount-column",
        },
        {
          title: "Other Account",
          field: "otherAmount",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          headerHozAlign: "right",
          hozAlign: "right",
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
          cssClass: "amount-column",
        },
        {
          title: "Total",
          field: "total",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          headerHozAlign: "right",
          hozAlign: "right",
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
          cssClass: "amount-column",
        },
        {
          title: "SbiBalance",
          field: "sbiBalance",
          formatter: "money",
          headerHozAlign: "right",
          hozAlign: "right",
          cssClass: "amount-column",
        },
        {
          title: "CashBalance",
          field: "cashBalance",
          formatter: "money",
          headerHozAlign: "right",
          hozAlign: "right",
          cssClass: "amount-column",
        },
        {
          title: "CbiBalance",
          field: "cbiBalance",
          formatter: "money",
          headerHozAlign: "right",
          hozAlign: "right",
          cssClass: "amount-column",
        },
        {
          title: "OtherBalance",
          field: "otherBalance",
          formatter: "money",
          headerHozAlign: "right",
          hozAlign: "right",
          cssClass: "amount-column",
        },
        {
          title: "TotalAvailable",
          field: "totalAvailable",
          formatter: "money",
          headerHozAlign: "right",
          hozAlign: "right",
          cssClass: "amount-column",
        },
        {
          title: "-",
          field: "-",
          maxWidth: 50,
          formatter: this.globalService.hidebuttonFormatter.bind(this),
          cellClick: (e, cell) => {
            const expenseId = cell.getRow().getData()["expenseId"];
            this.hideExpense(expenseId); // Call the hideExpense method
          },
        },
        {
          title: "",
          field: "",
          maxWidth: 50,
          formatter: (_cell) =>
            '<button class="action-buttons" title="More Actions" style="padding-right:100px;"><i class="bi bi-three-dots btn-link"></i></button>',
          clickMenu: this.optionsMenu,
          hozAlign: "left",
          headerSort: false,
        },
      ];
    } else if (this.activeComponent === NavigationURLs.EXPENSE_REPORT) {
      this.tableColumnConfig = [
        {
          title: "FirstDate",
          field: "firstDate",
          sorter: "alphanum",
          width: 100,
          formatter: this.dateFormatter.bind(this),
        },
        {
          title: "LastDate",
          field: "lastDate",
          sorter: "alphanum",
          width: 100,
          formatter: this.dateFormatter.bind(this),
        },
        {
          title: "Source/Reason",
          field: "sourceOrReason",
          sorter: "alphanum",
          width: 150,
        },
        {
          title: "Description",
          field: "description",
          sorter: "alphanum",
          width: 600,
          formatter: (cell) => {
            const value = cell.getValue() || "";
            return `<div class="text-wrap">${value}</div>`;
          },
          cssClass: "description-column",
        },
        {
          title: "TakenAmount",
          field: "takenAmount",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          headerHozAlign: "right",
          hozAlign: "right",
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
          cssClass: "amount-column",
        },
        {
          title: "GivenAmount",
          field: "givenAmount",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          headerHozAlign: "right",
          hozAlign: "right",
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
          cssClass: "amount-column",
        },
        {
          title: "TotalAmount",
          field: "totalAmount",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          headerHozAlign: "right",
          hozAlign: "right",
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
          cssClass: "amount-column",
        },
        {
          title: "",
          field: "",
          maxWidth: 70,
          formatter: this.globalService.hidebuttonFormatter.bind(this),
          cellClick: (e, cell) => {
            const sourceOrReason = cell.getRow().getData()["sourceOrReason"];
            this.hideExpenseBySource(sourceOrReason); // Call the hideExpense method
          },
          headerSort: false,
        },
        {
          title: "",
          field: "",
          maxWidth: 70,
          formatter: (_cell) =>
            '<button class="action-buttons" title="More Actions" style="padding-right:100px;"><i class="bi bi-three-dots btn-link"></i></button>',
          clickMenu: [
            {
              label: `<a class="dropdown-item btn-link">
                          <i class="bi bi-eye"></i>
                            &nbsp;View
                          </a>
                          `,
              action: (_e: any, cell: CellComponent) => {
                const expenseData = cell.getRow().getData();
                this.activeComponent = NavigationURLs.EXPENSE_LIST;
                this.sourceOrReason = expenseData["sourceOrReason"];
                this.reportFirstDate = this.dateUtil.formatStringDate(
                  expenseData["firstDate"]
                );
                this.reportLastDate = this.dateUtil.formatStringDate(
                  expenseData["lastDate"]
                );
                this.LoadGrid();
              },
            },
            {
              separator: true,
            },
            {
              label: `<a class="dropdown-item btn-link"
                      data-bs-toggle="modal" data-bs-target="#confirmationPopup">
                          <i class="bi bi-trash"></i>
                            &nbsp;Delete
                          </a>
                          `,
              action: (_e: any, cell: CellComponent) => {
                const expenseData = cell.getRow().getData();
                const expenseId = expenseData["expenseId"];
                this.deleteExpense(expenseId);
              },
            },
          ],
          hozAlign: "left",
          headerSort: false,
        },
      ];
    }
  }

  hideExpense(expenseId: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.expenseId != expenseId;
    });
  }

  hideExpenseBySource(sourceOrReason: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.sourceOrReason != sourceOrReason;
    });
  }

  dateFormatter(cell: CellComponent) {
    const columnName = cell.getColumn().getField();
    const projectData = cell.getRow().getData();
    const dateColumn = projectData[columnName];
    if (dateColumn) {
      return `<span>${this.datePipe.transform(
        dateColumn,
        ApplicationConstants.GLOBAL_DATE_FORMAT
      )}</span>`;
    }
    const nullDate = "";
    return `<span>${nullDate}</span>`;
  }

  amountColorFormatter(cell: CellComponent) {
    const columnName = cell.getColumn().getField();
    const projectData = cell.getRow().getData();
    const columnValue = projectData[columnName];
    const formattedValue = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(columnValue);
    if (columnValue > 0) {
      return `<span style="color:#129D0A; font-weight:bold">${formattedValue}</span>`;
    }
    if (columnValue < 0) {
      return `<span style="color:#FF0000; font-weight:bold">${formattedValue}</span>`;
    }
    return `<span></span>`;
  }

  getColorForText(cell: CellComponent): any {
    const projectData = cell.getRow().getData();
    const columnValue = projectData["purpose"];
    const sourceValue = projectData["sourceOrReason"];

    if (columnValue?.toLowerCase().includes("emergency")) {
      return `<span style="color:#FF0000; font-weight:bold">${sourceValue}</span>`;
    } else if (columnValue.toLowerCase().includes("return")) {
      return `<span style="color:#129D0A; font-weight:bold">${sourceValue}</span>`;
    } else if (columnValue.toLowerCase().includes("recharge")) {
      return `<span style="color:#F29D0A; font-weight:bold">${sourceValue}</span>`;
    } else {
      return `<span style="color:#000000; font-weight:bold">${sourceValue}</span>`;
    } // Default style (no style)
  }

  ngAfterViewInit() {
    flatpickr("#fromDate", {
      dateFormat: "d/m/Y",
      defaultDate: (() => {
        let date = new Date(); // Get the current date
        date.setDate(date.getDate() - 30); // Subtract 30 days
        return date;
      })(),
      onChange: (selectedDates, dateStr) => {
        if (!dateStr) {
          const today = new Date();
          today.setDate(today.getDate() - 30); // Subtract 30 days

          const dd = ("0" + today.getDate()).slice(-2);
          const mm = ("0" + (today.getMonth() + 1)).slice(-2); // Months are zero-based
          const yyyy = today.getFullYear();

          dateStr = `${dd}/${mm}/${yyyy}`; // Format as "DD/MM/YYYY"
        }
        this.filterGridByFromDate(dateStr);
      },
    });

    flatpickr("#toDate", {
      dateFormat: "d/m/Y", // Adjust the date format as per your requirement
      defaultDate: this.toDate,
      onChange: (selectedDates, dateStr) => {
        if (!dateStr) {
          const today = new Date();

          const dd = ("0" + today.getDate()).slice(-2);
          const mm = ("0" + (today.getMonth() + 1)).slice(-2); // Months are zero-based
          const yyyy = today.getFullYear();

          dateStr = `${dd}/${mm}/${yyyy}`; // Format as "DD/MM/YYYY"
        }
        this.filterGridByToDate(dateStr);
      },
    });
  }

  applyFilters() {
    if (this.activeComponent === NavigationURLs.EXPENSE_LIST) {
      this.filteredTableData = this.tableData.filter((item: any) => {
        const searchText =
          item.sourceOrReason.toLowerCase().includes(this.sourceOrReason) ||
          item.description.toLowerCase().includes(this.sourceOrReason);
        const minAmountCondition =
          this.minAmount == 0 ||
          (item.debit !== 0 && Math.abs(item.debit) >= this.minAmount) ||
          (item.credit !== 0 && Math.abs(item.credit) >= this.minAmount);
        const maxAmountCondition =
          this.maxAmount == 0 ||
          (item.debit !== 0 && Math.abs(item.debit) <= this.maxAmount) ||
          (item.credit !== 0 && Math.abs(item.credit) <= this.maxAmount);
        return searchText && minAmountCondition && maxAmountCondition;
      });
    } else if (this.activeComponent === NavigationURLs.EXPENSE_SUMMARY_LIST) {
      this.filteredTableData = this.tableData.filter((item: any) => {
        const searchText =
          item.sourceOrReason.toLowerCase().includes(this.sourceOrReason) ||
          item.description.toLowerCase().includes(this.sourceOrReason);
        const minAmountCondition =
          this.minAmount == 0 ||
          (item.sbiAccount !== null &&
            item.sbiAccount !== 0 &&
            Math.abs(item.sbiAccount) >= this.minAmount) ||
          (item.cbiAccount !== null &&
            item.cbiAccount !== 0 &&
            Math.abs(item.cbiAccount) >= this.minAmount) ||
          (item.cash !== null &&
            item.cash !== 0 &&
            Math.abs(item.cash) >= this.minAmount) ||
          (item.otherAmount !== null &&
            item.otherAmount !== 0 &&
            Math.abs(item.otherAmount) >= this.minAmount);
        const maxAmountCondition =
          this.maxAmount == 0 ||
          (item.sbiAccount !== null &&
            item.sbiAccount !== 0 &&
            Math.abs(item.sbiAccount) <= this.maxAmount) ||
          (item.cbiAccount !== null &&
            item.cbiAccount !== 0 &&
            Math.abs(item.cbiAccount) <= this.maxAmount) ||
          (item.cash !== null &&
            item.cash !== 0 &&
            Math.abs(item.cash) <= this.maxAmount) ||
          (item.otherAmount !== null &&
            item.otherAmount !== 0 &&
            Math.abs(item.otherAmount) <= this.maxAmount);
        return searchText && minAmountCondition && maxAmountCondition;
      });
    } else if (this.activeComponent === NavigationURLs.EXPENSE_REPORT) {
      this.filteredTableData = this.tableData.filter((item: any) => {
        const searchText =
          item.sourceOrReason.toLowerCase().includes(this.sourceOrReason) ||
          item.description.toLowerCase().includes(this.sourceOrReason);
        const minAmountCondition =
          this.minAmount == 0 ||
          (item.givenAmount !== null &&
            item.givenAmount !== 0 &&
            Math.abs(item.givenAmount) >= this.minAmount) ||
          (item.totalAmount !== null &&
            item.totalAmount !== 0 &&
            Math.abs(item.totalAmount) >= this.minAmount) ||
          (item.takenAmount !== null &&
            item.takenAmount !== 0 &&
            Math.abs(item.takenAmount) >= this.minAmount);
        const maxAmountCondition =
          this.maxAmount == 0 ||
          (item.givenAmount !== null &&
            item.givenAmount !== 0 &&
            Math.abs(item.givenAmount) <= this.maxAmount) ||
          (item.totalAmount !== null &&
            item.totalAmount !== 0 &&
            Math.abs(item.totalAmount) <= this.maxAmount) ||
          (item.takenAmount !== null &&
            item.takenAmount !== 0 &&
            Math.abs(item.takenAmount) <= this.maxAmount);
        return searchText && minAmountCondition && maxAmountCondition;
      });
    }
  }

  ClearFilter() {
    this.sourceOrReason = "";
    this.minAmount = 0;
    this.maxAmount = 0;
    if (this.searchInput) {
      this.searchInput.nativeElement.value = "";
    }
    if (this.minInput) {
      this.minInput.nativeElement.value = "";
    }
    if (this.maxInput) {
      this.maxInput.nativeElement.value = "";
    }
    this.LoadGrid();
  }

  getLatestExpenseDate(): any {
    if (!this.filteredTableData || this.filteredTableData.length === 0) {
      this.loaderService.hideLoader();
      return new Date(); // Return null if no data is available
    }
    this.loaderService.hideLoader();
    return this.filteredTableData[0]["expenseDate"];
  }

  goToExpenseList() {
    // this.router.navigate([NavigationURLs.EXPENSE_SUMMARY_LIST]);
    this.activeComponent = NavigationURLs.EXPENSE_LIST;
    this.LoadGrid();
  }

  goToExpenseSummary() {
    // this.router.navigate([NavigationURLs.EXPENSE_SUMMARY_LIST]);
    this.activeComponent = NavigationURLs.EXPENSE_SUMMARY_LIST;
    this.LoadGrid();
  }

  goToExpenseReport() {
    // this.router.navigate([NavigationURLs.EXPENSE_REPORT]);
    this.activeComponent = NavigationURLs.EXPENSE_REPORT;
    this.LoadGrid();
  }

  LoadGrid() {
    this.loaderService.showLoader();
    if (this.reportFirstDate) {
      this.formattedFromDate = this.reportFirstDate;
      this.reportFirstDate = "";
    } else {
      this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(
        this.fromDate
      );
    }
    if (this.reportLastDate) {
      this.formattedToDate = this.reportLastDate;
      this.reportLastDate = "";
    } else {
      this.formattedToDate = this.dateUtil.formatDateToMMDDYYYY(this.toDate);
    }
    this.columnConfiguration();
    if (this.activeComponent === NavigationURLs.EXPENSE_LIST) {
      this.expenseService
        .getExpenseList(
          this.formattedFromDate,
          this.formattedToDate,
          this.sourceOrReason,
          this.minAmount,
          this.maxAmount,
          ""
        )
        .subscribe({
          next: (res: any) => {
            this.tableData = res;
            this.filteredTableData = res;
            this.lastExpenseDate = this.getLatestExpenseDate();
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            console.log("error : ", error);
            this.loaderService.hideLoader();
          },
        });
    } else if (this.activeComponent === NavigationURLs.EXPENSE_SUMMARY_LIST) {
      this.expenseService
        .getExpenseSummaryList(
          this.formattedFromDate,
          this.formattedToDate,
          this.sourceOrReason,
          this.minAmount,
          this.maxAmount,
          ""
        )
        .subscribe({
          next: (res: any) => {
            this.tableData = res;
            this.filteredTableData = res;
            this.lastExpenseDate = this.getLatestExpenseDate();
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            console.log("error : ", error);
            this.loaderService.hideLoader();
          },
        });
    } else if (this.activeComponent === NavigationURLs.EXPENSE_REPORT) {
      this.expenseService
        .getExpenseReportList(
          this.formattedFromDate,
          this.formattedToDate,
          this.sourceOrReason,
          this.minAmount,
          this.maxAmount,
          ""
        )
        .subscribe({
          next: (res: any) => {
            this.tableData = res;
            this.filteredTableData = res;
            this.lastExpenseDate = this.getLatestExpenseDate();
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            console.log("error : ", error);
            this.loaderService.hideLoader();
          },
        });
    }
  }

  expenseDetails(data: any) {
    this.expenseDetailsComponent.openDetailsPopup(data);
  }

  deleteExpense(expenseId: string) {
    if (expenseId) {
      this.expenseId = expenseId;
      this.confirmationDialog.openConfirmationPopup(
        "Confirmation",
        "Are you sure you want to delete this expense? This action cannot be undone."
      );
    }
  }

  handleConfirmResult(isConfirmed: boolean) {
    console.log(isConfirmed);
    if (isConfirmed) {
      this.loaderService.showLoader();
      this.expenseService.deleteExpense(this.expenseId).subscribe({
        next: (res: any) => {
          this.LoadGrid();
        },
        error: (error: any) => {
          console.log("error : ", error);
          this.loaderService.hideLoader();
        },
      });
    }
  }

  filterGridByFromDate(date: any) {
    this.fromDate = this.dateUtil.convertDDMMYYYYToDate(date); // this.datepipe.transform(data.value, 'MM-dd-yyyy');
    // this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(this.fromDate);
    this.LoadGrid();
  }

  filterGridByToDate(date: any) {
    this.toDate = this.dateUtil.convertDDMMYYYYToDate(date); // this.datepipe.transform(data.value, 'MM-dd-yyyy');
    // this.formattedToDate = this.dateUtil.formatDateToMMDDYYYY(this.toDate);
    this.LoadGrid();
  }

  filterGridByMaxAmount(data: any) {
    setTimeout(() => {
      this.maxInput.nativeElement.focus();
    }, 0);
    this.maxAmount = data.target.value;
    if (this.sourceOrReason || this.minAmount || this.maxAmount) {
      this.applyFilters();
    } else {
      this.LoadGrid();
    }
  }

  filterGridByMinAmount(data: any) {
    setTimeout(() => {
      this.minInput.nativeElement.focus();
    }, 0);
    this.minAmount = data.target.value;
    if (this.sourceOrReason || this.minAmount || this.maxAmount) {
      this.applyFilters();
    } else {
      this.LoadGrid();
    }
  }

  filterGridBySearch(data: any) {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
    this.sourceOrReason = data?.target?.value?.toLowerCase();
    if (this.sourceOrReason || this.minAmount || this.maxAmount) {
      this.applyFilters();
    } else {
      this.LoadGrid();
    }
  }
}
