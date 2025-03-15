import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
import { Router } from "@angular/router";
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

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private globalService: GlobalService,
    public datePipe: DatePipe,
    private loaderService: LoaderService,
    private dateUtil: DateUtils
  ) {}

  ngOnInit() {
    this.loaderService.showLoader();
    this.expenseColumnConfiguration();
    this.fromDate.setDate(this.toDate.getDate() - 30);
    this.LoadGrid();
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
  expenseColumnConfiguration() {
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
        formatter: this.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const expenseId = cell.getRow().getData()["expenseId"];
          this.hideExpense(expenseId); // Call the hideExpense method
        },
      },
      {
        title: "",
        field: "options",
        maxWidth: 50,
        formatter: (_cell) =>
          '<button class="action-buttons" title="More Actions" style="padding-right:100px;"><i class="bi bi-three-dots btn-link"></i></button>',
        clickMenu: this.optionsMenu,
        hozAlign: "left",
        headerSort: false,
      },
    ];
  }

  hidebuttonFormatter(cell: CellComponent) {
    return `<button class="action-buttons" title="Hide Expense" style="padding-right:100px;"><i class="bi bi-dash-lg btn-link"></i></button>`;
  }

  hideExpense(expenseId: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.expenseId != expenseId;
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

  LoadGrid() {
    this.loaderService.showLoader();
    this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(this.fromDate);
    this.formattedToDate = this.dateUtil.formatDateToMMDDYYYY(this.toDate);

    this.getExpenseList();
    if (this.searchInput) {
      this.searchInput.nativeElement.value = "";
    }
    if (this.minInput) {
      this.minInput.nativeElement.value = "";
    }
    if (this.maxInput) {
      this.maxInput.nativeElement.value = "";
    }
  }

  applyFilters(all: boolean = false) {
    if (all) {
      this.getExpenseList();
    }
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
    console.log("this.lastExpenseDate : ", this.lastExpenseDate);
  }

  getLatestExpenseDate(): any {
    if (!this.filteredTableData || this.filteredTableData.length === 0) {
      this.loaderService.hideLoader();
      return new Date(); // Return null if no data is available
    }
    this.loaderService.hideLoader();
    return this.filteredTableData[0]["expenseDate"];
  }

  goToExpenseSummary() {
    this.router.navigate([NavigationURLs.EXPENSE_SUMMARY_LIST]);
  }

  getExpenseList() {
    this.loaderService.showLoader();
    this.filterColumns = this.tableColumnConfig.filter((col) =>
      ["SourceOrReason", "emailId"].includes(col.field ?? "")
    );
    this.expenseService
      .getExpenseList(
        this.formattedFromDate,
        this.formattedToDate,
        "",
        0,
        0,
        ""
      )
      .subscribe({
        next: (res: any) => {
          this.tableData = res;
          this.filteredTableData = res;
          this.lastExpenseDate = this.getLatestExpenseDate();
          console.log("this.lastExpenseDate : ", this.lastExpenseDate);
          console.log("this.filteredTableData : ", this.filteredTableData);
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log("error : ", error);
          this.loaderService.hideLoader();
        },
      });
  }

  expenseDetails(data: any) {
    this.loaderService.showLoader();
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
    this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(this.fromDate);
    this.LoadGrid();
  }

  filterGridByToDate(date: any) {
    this.toDate = this.dateUtil.convertDDMMYYYYToDate(date); // this.datepipe.transform(data.value, 'MM-dd-yyyy');
    this.formattedToDate = this.dateUtil.formatDateToMMDDYYYY(this.toDate);
    this.LoadGrid();
  }

  filterGridByMaxAmount(data: any) {
    this.maxAmount = data.target.value;
    setTimeout(() => {
      this.maxInput.nativeElement.focus();
    }, 0);
    this.applyFilters();
  }

  filterGridByMinAmount(data: any) {
    this.minAmount = data.target.value;
    setTimeout(() => {
      this.minInput.nativeElement.focus();
    }, 0);

    this.applyFilters();
  }

  filterGridBySearch(data: any) {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
    this.sourceOrReason = data?.target?.value?.toLowerCase();
    this.applyFilters();
  }

  validateAmount(event: any) {
    // if (event.target.value.match(/^[0-9]{0,20}$/)) {
    if (event.key.match(/^[\D]$/) && event.key.match(/^[^\.\-]$/)) {
      event.preventDefault();
    }
  }
}
