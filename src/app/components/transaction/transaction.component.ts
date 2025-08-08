import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import flatpickr from "flatpickr";
import { CellComponent, ColumnDefinition } from "tabulator-tables";
import {
  ApplicationConstants,
  ActionConstant,
  ApplicationModules,
  ApplicationTableConstants,
  NavigationURLs,
  ApplicationConstantHtml,
} from "../../../utils/application-constants";
import { DateUtils } from "../../../utils/date-utils";
import { ExpenseFilterRequest } from "../../interfaces/expense-filter-request";
import { TransactionService } from "../../services/transaction/transaction.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { TransactionDetailsComponent } from "../transaction-details/transaction-details.component";
import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { ToasterComponent } from "../shared/toaster/toaster.component";
export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: "app-transaction",
  standalone: true,
  imports: [
    CommonModule,
    TabulatorGridComponent,
    TransactionDetailsComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: "./transaction.component.html",
  providers: [DatePipe, DateUtils],
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  @ViewChild("searchInput") searchInput!: ElementRef;
  @ViewChild("minInput") minInput!: any;
  @ViewChild("maxInput") maxInput!: any;
  @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(TransactionDetailsComponent)
  transactionDetailsComponent!: TransactionDetailsComponent;
  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;

  public tableData: Record<string, unknown>[] = [];
  public filteredTableData: Record<string, unknown>[] = [];
  public columnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];

  lastTransactionDate: Date = new Date();

  fromDate = DateUtils.GetDateBeforeDays(30);
  toDate = DateUtils.GetDateBeforeDays(0);
  sourceOrReason: string = "";
  minAmount: number = 0;
  maxAmount: number = 0;
  transactionId: string = "";
  activeComponent: string = NavigationURLs.EXPENSE_LIST;
  reportLastDate = "";
  reportFirstDate = "";
  transactionfilterRequest: ExpenseFilterRequest = {
    fromDate: this.fromDate,
    toDate: this.toDate,
    minAmount: this.minAmount,
    maxAmount: this.maxAmount,
    sourceOrReason: ''
  };
  ActionConstant = ActionConstant;
  accountColumns: any;
  // optionsMenu = [
  //   {
  //     label: ApplicationConstantHtml.EDIT_LABLE,
  //     action: (_e: any, cell: CellComponent) => {
  //       const transactionData = cell.getRow().getData();
  //       const transactionId = transactionData["id"];
  //       this.transactionDetails(transactionId);
  //     },
  //   },
  //   {
  //     separator: true,
  //   },
  //   {
  //     label: ApplicationConstantHtml.DELETE_LABLE,
  //     action: (_e: any, cell: CellComponent) => {
  //       const transactionData = cell.getRow().getData();
  //       const transactionId = transactionData["id"];
  //       this.deleteTransaction(transactionId);
  //     },
  //   },
  // ];

  constructor(
    private transactionService: TransactionService,
    public datePipe: DatePipe,
    public globalService: GlobalService,
    private loaderService: LoaderService) { }

  ngOnInit() {
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
      this.columnConfig = [
        {
          title: "Transaction Date",
          field: "transactionDate",
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
          field: "accountName",
          sorter: "alphanum",
        },
        {
          title: "Debit",
          field: "expense",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
        },
        {
          title: "Credit",
          field: "income",
          sorter: "alphanum",
          formatter: this.amountColorFormatter.bind(this),
          bottomCalc: "sum",
          bottomCalcFormatter: this.amountColorFormatter.bind(this),
          bottomCalcFormatterParams: { symbol: "", precision: 2 },
        },
        {
          title: "",
          field: "",
          maxWidth: 70,
          formatter: this.globalService.hidebuttonFormatter.bind(this),
          cellClick: (e, cell) => {
            const transactionId = cell.getRow().getData()["id"];
            this.hideTransaction(transactionId);
          },
          hozAlign: "center",
          headerSort: false,
        },
      ];
      if (
        this.globalService.isAccessible(ActionConstant.EDIT) ||
        this.globalService.isAccessible(ActionConstant.DELETE)
      ) {
        this.columnConfig.push({
          title: "",
          field: "option",
          maxWidth: 70,
          formatter: this.globalService.threeDotsFormatter.bind(this),//will used for row-wise condition
          hozAlign: "center",
          headerSort: false,
        });
      }

    } else if (this.activeComponent === NavigationURLs.EXPENSE_SUMMARY_LIST) {
      this.columnConfig = [
        {
          title: "Transaction Date",
          field: "transactionDate",
          sorter: "alphanum",
          // width: 100,
          formatter: this.dateFormatter.bind(this),
        },
        {
          title: "Source/Reason",
          field: "sourceOrReason",
          // width: 150,
          sorter: "alphanum",
        },
        {
          title: "Description",
          field: "description",
          // width: 200,
          sorter: "alphanum",
        },
      ];
      if (this.tableData.length > 0 && this.accountColumns) {
        for (const key of Object.keys(this.accountColumns)) {
          const isAmount = key.toLowerCase().includes("amount");
          const isBalance = key.toLowerCase().includes("balance");
          const isCategory = key.toLowerCase().includes("category");
          if (!key.toLowerCase().includes("category")) {
            this.columnConfig.push({
              title: key,
              field: `accountData.${key}`,
              // field:this.globalService.lowercaseFirstLetterOfEachWord(key),
              formatter: this.summaryAmountColorFormatter.bind(this),
              hozAlign: "center",
              headerHozAlign: "center",
              cssClass: "amount-column",
              bottomCalc: "sum",
              bottomCalcFormatter: this.amountColorFormatter.bind(this),
              bottomCalcFormatterParams: { symbol: "", precision: 2 },
              // width: 150,
            });
          }
        }
      }
      this.columnConfig.push({
        title: "",
        field: "",
        maxWidth: 70,
        formatter: this.globalService.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const transactionId = cell.getRow().getData()["id"];
          this.hideTransaction(transactionId);
        },
        headerSort: false,
      });
      if (
        this.globalService.isAccessible(ActionConstant.EDIT) ||
        this.globalService.isAccessible(ActionConstant.DELETE)
      ) {
        this.columnConfig.push({
          title: "",
          field: "option",
          maxWidth: 70,
          formatter: this.globalService.threeDotsFormatter.bind(this),//will used for row-wise condition
          hozAlign: "center",
          headerSort: false,
        });
      }


    } else if (this.activeComponent === NavigationURLs.EXPENSE_REPORT) {
      this.columnConfig = [
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
            this.hideTransactionBySource(sourceOrReason);
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
              label: ApplicationConstantHtml.VIEW_LABLE,
              action: (_e: any, cell: CellComponent) => {
                const transactionData = cell.getRow().getData();
                this.activeComponent = NavigationURLs.EXPENSE_LIST;
                this.sourceOrReason = transactionData["sourceOrReason"];
                this.reportFirstDate = DateUtils.formatStringDate(
                  transactionData["firstDate"]
                );
                this.reportLastDate = DateUtils.formatStringDate(
                  transactionData["lastDate"]
                );
                this.LoadGrid();
              },
            },
            {
              separator: true,
            },
            {
              label: ApplicationConstantHtml.DELETE_LABLE,
              action: (_e: any, cell: CellComponent) => {
                const transactionData = cell.getRow().getData();
                const transactionId = transactionData["id"];
                this.deleteTransaction(transactionId);
              },
            },
          ],
          hozAlign: "left",
          headerSort: false,
        },
      ];
    }
  }

  generateOptionsMenu(rowData: Record<string, any>) {
    const menu = [];
    if (this.globalService.isAccessible(ActionConstant.EDIT)) {
      menu.push({
        label: ApplicationConstantHtml.EDIT_LABLE,
        action: () => {
          this.transactionDetails(rowData['transactionGroupId']);
        },
      });
    }
    if (this.globalService.isAccessible(ActionConstant.DELETE)) {
      menu.push({
        label: ApplicationConstantHtml.DELETE_LABLE,
        action: () => {
          this.deleteTransaction(rowData['id']);
        },
      });
    }
    return menu;
  }


  hideTransaction(transactionId: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.id != transactionId;
    });
  }

  removeTransaction(transactionId: any) {
    this.tableData = this.tableData.filter((item: any) => {
      return item.id != transactionId;
    });
  }

  hideTransactionBySource(sourceOrReason: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.sourceOrReason != sourceOrReason;
    });
  }

  dateFormatter(cell: CellComponent) {
    const columnName = cell.getColumn().getField();
    const transactionData = cell.getRow().getData();
    const dateColumn = transactionData[columnName];
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
    const transactionData = cell.getRow().getData();
    const columnValue = transactionData[columnName];
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

  summaryAmountColorFormatter(cell: CellComponent) {
    const cellValue = cell.getValue();
    const transactionData = cell.getRow().getData();
    const field = cell.getColumn().getField(); // e.g., "accountData.SBI_Amount"

    if (!transactionData || !transactionData['accountData'] || (typeof cellValue !== 'number' && cellValue !== null && cellValue !== undefined)) {
      return `<span>${cellValue}</span>`;
    }

    // Extract base account name from the amount field
    const amountKeyMatch = field.match(/accountData\.([^.]+)_Amount/i);
    const balanceKeyMatch = field.match(/accountData\.([^.]+)_Balance/i);
    if (amountKeyMatch) {
      const accountBase = amountKeyMatch[1]; // e.g., "SBI"
      const categoryField = `${accountBase}_Category`;
      const category = transactionData['accountData'][categoryField];

      // Format currency
      const formattedValue = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(cellValue);

      if (category === 'Income') {
        return `<span style="color:#129D0A; font-weight:bold">${cellValue}</span>`;
      } else if (category === 'Expense') {
        return `<span style="color:#FF0000; font-weight:bold">${cellValue}</span>`;
      }
    }
    if (balanceKeyMatch) {
      debugger;
      if (cellValue == null) {
        return `<span></span>`;
      }
      if (cellValue >= 0) {
        return `<span style="color:#129D0A; font-weight:bold">${cellValue}</span>`;
      }
      return `<span style="color:#FF0000; font-weight:bold">${cellValue}</span>`;
    }
    return `<span></span>`;
  }

  getColorForText(cell: CellComponent): any {
    const transactionData = cell.getRow().getData();
    const columnValue = transactionData["purpose"];
    const sourceValue = transactionData["sourceOrReason"];

    if (columnValue?.toLowerCase().includes("emergency")) {
      return `<span style="color:#FF0000; font-weight:bold">${sourceValue}</span>`;
    } else if (columnValue?.toLowerCase().includes("return")) {
      return `<span style="color:#129D0A; font-weight:bold">${sourceValue}</span>`;
    } else if (columnValue?.toLowerCase().includes("recharge")) {
      return `<span style="color:#F29D0A; font-weight:bold">${sourceValue}</span>`;
    } else {
      return `<span style="color:#000000; font-weight:bold">${sourceValue}</span>`;
    }
  }


  ngAfterViewInit() {

    flatpickr("#fromDate", {
      dateFormat: "d/m/Y",
      defaultDate: (() => {
        let date = DateUtils.strFormatToDDMMYYYY(this.fromDate);
        return date;
      })(),
      onChange: (selectedDates, dateStr) => {
        let fromDate = dateStr;
        if (!dateStr) {
          const fromDate = DateUtils.GetDateBeforeDays(30)
        }
        this.filterGridByFromDate(fromDate);
      },
    });

    flatpickr("#toDate", {
      dateFormat: "d/m/Y",
      defaultDate: DateUtils.strFormatToDDMMYYYY(this.toDate),
      onChange: (selectedDates, dateStr) => {
        if (!dateStr) {
          const today = DateUtils.GetDateBeforeDays(0);
          dateStr = today;
        }
        this.filterGridByToDate(dateStr);
      },
    });

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
      } else { // Hide global dropdown
        const globalMenu = document.getElementById('globalDropdownMenu');
        if (globalMenu) globalMenu.remove();
      }
    });

  }

  applyFilters() {
    if (this.activeComponent === NavigationURLs.EXPENSE_LIST) {
      this.filteredTableData = this.tableData.filter((item: any) => {
        const searchText =
          item.sourceOrReason?.toLowerCase().includes(this.sourceOrReason) ||
          item.description?.toLowerCase().includes(this.sourceOrReason);
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
          item.sourceOrReason?.toLowerCase().includes(this.sourceOrReason) ||
          item.description?.toLowerCase().includes(this.sourceOrReason);
        const minAmountCondition =
          this.minAmount == 0 ||
          (item.sbiAccount !== null && item.sbiAccount !== 0 && Math.abs(item.sbiAccount) >= this.minAmount) ||
          (item.cbiAccount !== null && item.cbiAccount !== 0 && Math.abs(item.cbiAccount) >= this.minAmount) ||
          (item.cash !== null && item.cash !== 0 && Math.abs(item.cash) >= this.minAmount) ||
          (item.other !== null && item.other !== 0 && Math.abs(item.other) >= this.minAmount);
        // (item.sbiBalance !== null && item.sbiBalance !== 0 && Math.abs(item.sbiBalance) >= this.minAmount) || 
        // (item.cbiBalance !== null && item.cbiBalance !== 0 && Math.abs(item.cbiBalance) >= this.minAmount) ||
        // (item.cashBalance !== null && item.cashBalance !== 0 && Math.abs(item.cashBalance) >= this.minAmount) ||
        // (item.otherBalance !== null && item.otherBalance !== 0 && Math.abs(item.otherBalance) >= this.minAmount) ||
        // (item.totalAvailable !== null && item.totalAvailable !== 0 && Math.abs(item.totalAvailable) >= this.minAmount);
        const maxAmountCondition =
          this.maxAmount == 0 ||
          (item.sbiAccount !== null && item.sbiAccount !== 0 && Math.abs(item.sbiAccount) <= this.maxAmount) ||
          (item.cbiAccount !== null && item.cbiAccount !== 0 && Math.abs(item.cbiAccount) <= this.maxAmount) ||
          (item.cash !== null && item.cash !== 0 && Math.abs(item.cash) <= this.maxAmount) ||
          (item.other !== null && item.other !== 0 && Math.abs(item.other) <= this.maxAmount);
        // (item.sbiBalance !== null && item.sbiBalance !== 0 && Math.abs(item.sbiBalance) <= this.maxAmount) || 
        // (item.cbiBalance !== null && item.cbiBalance !== 0 && Math.abs(item.cbiBalance) <= this.maxAmount) ||
        // (item.cashBalance !== null && item.cashBalance !== 0 && Math.abs(item.cashBalance) <= this.maxAmount) ||
        // (item.otherBalance !== null && item.otherBalance !== 0 && Math.abs(item.otherBalance) <= this.maxAmount)||
        // (item.totalAvailable !== null && item.totalAvailable !== 0 && Math.abs(item.totalAvailable) <= this.minAmount);

        return searchText && minAmountCondition && maxAmountCondition;
      });
    } else if (this.activeComponent === NavigationURLs.EXPENSE_REPORT) {
      this.filteredTableData = this.tableData.filter((item: any) => {
        const searchText =
          item.sourceOrReason?.toLowerCase().includes(this.sourceOrReason) ||
          item.description?.toLowerCase().includes(this.sourceOrReason);
        const minAmountCondition =
          this.minAmount == 0 ||
          (item.givenAmount !== null && item.givenAmount !== 0 && Math.abs(item.givenAmount) >= this.minAmount) ||
          (item.totalAmount !== null && item.totalAmount !== 0 && Math.abs(item.totalAmount) >= this.minAmount) ||
          (item.takenAmount !== null && item.takenAmount !== 0 && Math.abs(item.takenAmount) >= this.minAmount);
        const maxAmountCondition =
          this.maxAmount == 0 ||
          (item.givenAmount !== null && item.givenAmount !== 0 && Math.abs(item.givenAmount) <= this.maxAmount) ||
          (item.totalAmount !== null && item.totalAmount !== 0 && Math.abs(item.totalAmount) <= this.maxAmount) ||
          (item.takenAmount !== null && item.takenAmount !== 0 && Math.abs(item.takenAmount) <= this.maxAmount);
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

  getLatestTransactionDate(): any {
    if (!this.filteredTableData || this.filteredTableData.length === 0) {
      this.loaderService.hideLoader();
      return new Date();
    }
    this.loaderService.hideLoader();
    return this.filteredTableData[0]["transactionDate"];
  }

  goToTransactionList() {
    this.activeComponent = NavigationURLs.EXPENSE_LIST;
    this.LoadGrid();
  }

  goToTransactionSummary() {
    this.activeComponent = NavigationURLs.EXPENSE_SUMMARY_LIST;
    this.LoadGrid();
  }

  goToTransactionReport() {
    this.activeComponent = NavigationURLs.EXPENSE_REPORT;
    this.LoadGrid();
  }

  LoadGrid() {

    this.loaderService.showLoader();
    this.columnConfiguration();
    this.transactionfilterRequest = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      minAmount: this.minAmount,
      maxAmount: this.maxAmount,
      sourceOrReason: this.sourceOrReason,
    };
    if (this.activeComponent === NavigationURLs.EXPENSE_LIST) {
      this.transactionService
        .getTransactionList(this.transactionfilterRequest)
        .subscribe({
          next: (res: any) => {
            this.tableData = res;
            this.filteredTableData = res;
            this.lastTransactionDate = this.getLatestTransactionDate();
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            console.log("error : ", error);
            this.loaderService.hideLoader();
          },
        });
    } else if (this.activeComponent === NavigationURLs.EXPENSE_SUMMARY_LIST) {
      this.transactionService
        .getTransactionSummaryList(this.transactionfilterRequest)
        .subscribe({
          next: (res: any) => {
            this.tableData = res;
            this.filteredTableData = res;
            this.accountColumns = res[0]?.accountData;
            this.columnConfiguration();

            this.lastTransactionDate = this.getLatestTransactionDate();
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            console.log("error : ", error);
            this.loaderService.hideLoader();
          },
        });
    } else if (this.activeComponent === NavigationURLs.EXPENSE_REPORT) {
      this.transactionService
        .getTransactionReportList(this.transactionfilterRequest)
        .subscribe({
          next: (res: any) => {
            this.tableData = res;
            this.filteredTableData = res;
            this.lastTransactionDate = this.getLatestTransactionDate();
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            console.log("error : ", error);
            this.loaderService.hideLoader();
          },
        });
    }
  }

  transactionDetails(data: any) {
    this.transactionDetailsComponent.openDetailsPopup(data);
  }

  deleteTransaction(transactionId: string) {
    if (transactionId) {
      this.transactionId = transactionId;
      this.confirmationDialog.openConfirmationPopup(
        "Confirmation",
        "Are you sure you want to delete this transaction? This action cannot be undone."
      );
    }
  }

  handleConfirmResult(isConfirmed: boolean) {
    console.log(isConfirmed);
    if (isConfirmed) {
      this.loaderService.showLoader();
      this.transactionService.deleteTransaction(this.transactionId).subscribe({
        next: (res: any) => {
          this.removeTransaction(this.transactionId);
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log("error : ", error);
          this.loaderService.hideLoader();
        },
      });
    }
  }

  filterGridByFromDate(date: any) {
    this.fromDate = DateUtils.CorrectedDate(date);
    this.LoadGrid();
  }

  filterGridByToDate(date: any) {
    this.toDate = DateUtils.CorrectedDate(date);
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
