import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import flatpickr from 'flatpickr';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { ApplicationConstants, ApplicationModules, ApplicationTableConstants } from '../../../utils/application-constants';
import { DateUtils } from '../../../utils/date-utils';
import { ExpenseService } from '../../services/expense/expense.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ExpenseDetailsComponent } from '../expense-details/expense-details.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { TabulatorGridComponent } from '../shared/tabulator-grid/tabulator-grid.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-expense-summary',
  standalone: true,
  imports: [CommonModule, TabulatorGridComponent, ExpenseDetailsComponent, ConfirmationDialogComponent],
  templateUrl: './expense-summary.component.html',
  providers: [DatePipe, DateUtils],
  styleUrls: ['./expense-summary.component.scss']
})

export class ExpenseSummaryComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('minInput') minInput!: any;
  @ViewChild('maxInput') maxInput!: any;
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
  sourceOrReason: string = '';
  minAmount: number = 0;
  maxAmount: number = 0;
  sourceOrReasonList: any;
  expenseId: string = '';
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
        const expenseId = expenseData['expenseId'];
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
        const expenseId = expenseData['expenseId'];
        this.deleteExpense(expenseId);
      },
    },
  ];


  constructor(private expenseService: ExpenseService,
    private _globalService: GlobalService,
    public datePipe: DatePipe,
    private loaderService: LoaderService,
    private dateUtil: DateUtils

  ) { }

  ngOnInit() {
    this.loaderService.showLoader();
    this.fromDate.setDate(this.toDate.getDate() - 60);
    this.getSourceOrReasonList();
    this.LoadGrid();
    this._globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.EXPENSE) {
        this.LoadGrid();
      }
    });
    this._globalService.refreshList$.subscribe((listName: string) => {
      if (listName === ApplicationModules.EXPENSE) {
        this.applyFilters();
      }
    });
  }

  tableColumnConfiguration() {
    this.tableColumnConfig = [
      {
        title: 'Expense Date',
        field: 'expenseDate',
        sorter: 'alphanum',
        formatter: this.dateFormatter.bind(this),
      },
      {
        title: 'Source/Reason',
        field: 'sourceOrReason',
        sorter: 'alphanum',
      },
      {
        title: 'SBI Account',
        field: 'sbiAccount',
        sorter: 'alphanum',
      },
      {
        title: 'CBI Account',
        field: 'cbiAccount',
        sorter: 'alphanum',
      },
      {
        title: 'Cash Account',
        field: 'cash',
        sorter: 'alphanum',
      },
      {
        title: 'Other Account',
        field: 'other',
        sorter: 'alphanum',
      },
      {
        title: 'Total',
        field: 'total',
        sorter: 'alphanum',
      },
      {
        title: 'SbiBalance',
        field: 'sbiBalance',
        sorter: 'alphanum',
      },
      {
        title: 'CashBalance',
        field: 'cashBalance',
        sorter: 'alphanum',
      },
      {
        title: 'CbiBalance',
        field: 'cbiBalance',
        sorter: 'alphanum',
      },
      {
        title: 'OtherBalance',
        field: 'otherBalance',
        sorter: 'alphanum',
      },
      {
        title: 'TotalAvailable',
        field: 'totalAvailable',
        sorter: 'alphanum',
      },
      {
        title: '',
        field: 'options',
        maxWidth: 50,
        formatter: (_cell) =>
          '<button class="action-buttons" title="More Actions" style="padding-right:100px;"><i class="bi bi-three-dots btn-link"></i></button>',
        clickMenu: this.optionsMenu,
        hozAlign: 'left',
        headerSort: false,
      },
    ];
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
    const nullDate = '';
    return `<span>${nullDate}</span>`;
  }

  ngAfterViewInit() {

    flatpickr('#fromDate', {
      dateFormat: 'd/m/Y',
      defaultDate: (() => {
        let date = new Date(); // Get the current date
        date.setDate(date.getDate() - 60); // Subtract 60 days
        return date;
      })(),
      onChange: (selectedDates, dateStr) => {
        if (!dateStr) {
          const today = new Date();
          today.setDate(today.getDate() - 60); // Subtract 60 days

          const dd = ('0' + today.getDate()).slice(-2);
          const mm = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based
          const yyyy = today.getFullYear();

          dateStr = `${dd}/${mm}/${yyyy}`; // Format as "DD/MM/YYYY"
        }
        this.filterGridByFromDate(dateStr);
      }

    });

    flatpickr('#toDate', {
      dateFormat: 'd/m/Y', // Adjust the date format as per your requirement
      defaultDate: this.toDate,
      onChange: (selectedDates, dateStr) => {
        if (!dateStr) {
          const today = new Date();

          const dd = ('0' + today.getDate()).slice(-2);
          const mm = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based
          const yyyy = today.getFullYear();

          dateStr = `${dd}/${mm}/${yyyy}`; // Format as "DD/MM/YYYY"
        }
        this.filterGridByToDate(dateStr);
      }
    });
  }

  getTotalSbiAccount(): number {
    if (this.filteredTableData)
      return this.filteredTableData.reduce((total: any, item: any) => total + (item.SbiAccount || 0), 0);
    else return 0;
  }
  getTotalCbiAccount(): number {
    if (this.filteredTableData)
      return this.filteredTableData.reduce((total: any, item: any) => total + (item.CbiAccount || 0), 0);
    else return 0;
  }
  getTotalCash(): number {
    if (this.filteredTableData)
      return this.filteredTableData.reduce((total: any, item: any) => total + (item.Cash || 0), 0);
    else return 0;
  }
  getTotalOther(): number {
    if (this.filteredTableData)
      return this.filteredTableData.reduce((total: any, item: any) => total + (item.Other || 0), 0);
    else return 0;
  }

  LoadGrid() {
    this.loaderService.showLoader();
    this.tableColumnConfiguration();
    this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(this.fromDate)
    this.formattedToDate = this.dateUtil.formatDateToMMDDYYYY(this.toDate)
    this.getExpenseSummaryList();
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    if (this.minInput) {
      this.minInput.nativeElement.value = '';
    }
    if (this.maxInput) {
      this.maxInput.nativeElement.value = '';
    }
  }

  getSourceOrReasonList() {
    this.loaderService.showLoader();
    this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(this.fromDate)
    this.formattedToDate = this.dateUtil.formatDateToMMDDYYYY(this.toDate)
    this.expenseService.getSourceOrReasonList(
      this.fromDate.toString(), this.toDate.toString(), this.sourceOrReason
    )
      .subscribe({
        next: (res: any) => {
          this.sourceOrReasonList = res;
          console.log('data: ', res);
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }


  applyFilters(all: boolean = false) {
    if (all) {
      this.getExpenseSummaryList();
    }
    this.filteredTableData = this.tableData.filter((item: any) => {
      const searchText = item.SourceOrReason.toLowerCase().includes(this.sourceOrReason) || item.Description.toLowerCase().includes(this.sourceOrReason);
      const minAmountCondition = this.minAmount == 0 || (item.Debit !== 0 && Math.abs(item.Debit) >= this.minAmount) || (item.Credit !== 0 && Math.abs(item.Credit) >= this.minAmount);
      const maxAmountCondition = this.maxAmount == 0 || (item.Debit !== 0 && Math.abs(item.Debit) <= this.maxAmount) || (item.Credit !== 0 && Math.abs(item.Credit) <= this.maxAmount);
      return searchText && minAmountCondition && maxAmountCondition;
    });
  }


  onSourceOrReasonChange(valueToFilter: any) {
    this.sourceOrReason = valueToFilter.target.value.toLowerCase();
    this.getSourceOrReasonList();
    this.applyFilters();
  }


  getExpenseSummaryList() {
    this.loaderService.showLoader();
    this.expenseService.getExpenseSummaryList(this.formattedFromDate, this.formattedToDate, '', 0, 0, '')
      .subscribe({
        next: (res: any) => {
          this.tableData = res;
          this.filteredTableData = res;
          console.log('this.filteredTableData : ', this.filteredTableData);
          this.lastExpenseDate = this.getLatestExpenseDate();
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }


  getLatestExpenseDate(): any {
    if (!this.filteredTableData || this.filteredTableData.length === 0) {
      this.loaderService.hideLoader();
      return new Date(); // Return null if no data is available
    }
    this.loaderService.hideLoader();
    return this.filteredTableData[0]['expenseDate'];
  }

  expenseDetails(data: any) {
    console.log('expenseDetails clicked');

    this.expenseDetailsComponent.openDetailsPopup(data);
  }


  deleteExpense(expenseId: string) {
    if (expenseId) {
      this.expenseId = expenseId;
      this.confirmationDialog.openConfirmationPopup(
        'Confirmation',
        'Are you sure you want to delete this expense? This action cannot be undone.'
      );
    }
  }

  handleConfirmResult(isConfirmed: boolean) {
    console.log(isConfirmed);
    this.expenseService.deleteExpense(this.expenseId)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.LoadGrid();
          }
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }


  addExpense(expense: any, item: any) {
    this.expenseService.addExpense(expense)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.LoadGrid();
          }
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }

  expenseAdjustment(data: any) {
  }

  convertDDMMYYYYToDate(dateString: string): Date {
    const [day, mon, year] = dateString.split('/').map(Number);
    // Months are 0-based in JavaScript Date objects, so subtract 1 from month
    return new Date(year, mon - 1, day);
  }

  filterGridByFromDate(date: any) {
    console.log('fromDate : ', this.fromDate);

    this.fromDate = this.convertDDMMYYYYToDate(date);;// this.datepipe.transform(data.value, 'MM-dd-yyyy');
    console.log('fromDate : ', this.fromDate);
    this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(this.fromDate);
    this.getSourceOrReasonList();
    this.LoadGrid();
  }

  filterGridByToDate(date: any) {
    this.toDate = this.convertDDMMYYYYToDate(date);;// this.datepipe.transform(data.value, 'MM-dd-yyyy');
    this.formattedToDate = this.dateUtil.formatDateToMMDDYYYY(this.toDate);
    this.getSourceOrReasonList();
    this.LoadGrid();
  }

  filterGridByMaxAmount(data: any) {
    this.maxAmount = data.target.value;
    this.applyFilters();
  }

  filterGridByMinAmount(data: any) {
    this.minAmount = data.target.value;
    this.applyFilters();
  }

  filterGridBySource(data: any) {
    if (data.source != null && data.source != undefined) {
      this.sourceOrReason = data.source.value.toLowerCase();
    }
    else if (data.value != null && data.value != undefined) {
      this.sourceOrReason = data.source.value.toLowerCase();
    }
    this.applyFilters();
  }

  filterGridBySearch(data: any) {
    this.sourceOrReason = data.target.value.toLowerCase();
    this.applyFilters();
  }

  getColorForAmount(amount: any): any {
    if (amount <= 0) {
      return { 'color': '#FF0000', 'font-weight': 'bold' };
    }
    else {
      return { 'color': '#129D0A', 'font-weight': 'bold' };
    }
  }

  getColorForText(col: any): any {
    if (col.toLowerCase().includes('emergency')) {
      return { 'color': '#FF0000', 'font-weight': 'bold' };
    }
    else if (col.toLowerCase().includes('return')) {
      return { 'color': '#129D0A', 'font-weight': 'bold' };
    }
    else if (col.toLowerCase().includes('recharge')) {
      return { 'color': '#F29D0A', 'font-weight': 'bold' };
    }
    else
      return {}; // Default style (no style)
  }

  validateAmount(event: any) {
    // if (event.target.value.match(/^[0-9]{0,20}$/)) {
    if (event.key.match(/^[\D]$/) && event.key.match(/^[^\.\-]$/)) {
      event.preventDefault();
    }
  }
}


