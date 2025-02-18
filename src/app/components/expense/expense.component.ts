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
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, TabulatorGridComponent, ExpenseDetailsComponent, ConfirmationDialogComponent],
  templateUrl: './expense.component.html',
  providers: [DatePipe, DateUtils],
  styleUrls: ['./expense.component.scss']
})

export class ExpenseComponent implements OnInit {
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
  public expenseColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE; // Set default pagination size
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];
  latestDate: Date = new Date();
  index: number = 0;
  expenseDataSource!: any;
  filteredExpenseDataSource!: any;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  fromDate = new Date();
  toDate = new Date();
  formattedFromDate: any;
  formattedToDate: any;
  sourceOrReason: string = '';
  SpecificSourceOrReason: string = '';
  minAmount: number = 0;
  maxAmount: number = 0;
  modeOfTransaction: string = '';
  modeOfTransactionList: any
  sourceOrReasonList: any;
  amountStyle = "'color':'red'";
  event: any;
  selectedTabIndex = 0;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  selectedCount: number = 0;
  key: string = 'dayData.name';
  reverse: boolean = false;
  expenseSelected: number[] = [];
  summarySelected: number[] = [];

  isAllChecked: boolean = false;
  sortDir = 1;
  sortClickCount = 0;
  selectedCheckboxMap: { [key: number]: boolean } = {};
  itemCountList: string = '';
  pageSizeOptions = [10, 15, 20, 50, 100, 500, 1000];
  itemsPerPage = 10;
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
        const expenseId = expenseData['ExpenseId'];
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
        const expenseId = expenseData['ExpenseId'];
        this.deleteExpense(expenseId);
      },
    },
  ];
  expenseId: string = '';

  constructor(private expenseService: ExpenseService,
    private _globalService: GlobalService,
    public datePipe: DatePipe,
    private loaderService: LoaderService,
    private dateUtil: DateUtils

  ) {
    // this._httpClient.get(_globalService.getCommonListItems(constants.MODEOFTRANSACTION)).subscribe(res => {
    //   this.modeOfTransactionList = res;
    // });
  }

  ngOnInit() {
    this.fromDate.setDate(this.toDate.getDate() - 60);
    // this.fromDt = this.datepipe.transform(this.fromDate, 'dd/MM/yyyy');
    // this.toDt = this.datepipe.transform(this.toDate, 'dd/MM/yyyy');
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
  expenseColumnConfiguration() {
    this.expenseColumnConfig = [
      {
        title: 'Expense Date',
        field: 'expenseDate',
        sorter: 'alphanum',
        formatter: this.uploadedDateFormatter.bind(this),
      },
      {
        title: 'Source/Reason',
        field: 'sourceOrReason',
        sorter: 'alphanum',
      },
      {
        title: 'Description',
        field: 'description',
        sorter: 'alphanum',
        width: 400,
      },
      {
        title: 'ModeOfTransaction',
        field: 'modeOfTransaction',
        sorter: 'alphanum',
      },
      {
        title: 'Debit',
        field: 'debit',
        sorter: 'alphanum',
      },
      {
        title: 'Credit',
        field: 'credit',
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

  uploadedDateFormatter(cell: CellComponent) {
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
      // defaultDate: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000),
      defaultDate: (() => {
        let date = new Date(); // Get the current date
        date.setDate(date.getDate() - 90); // Subtract 90 days
        return date;
      })(),
      onChange: (selectedDates, dateStr) => {
        // // this.fromDt = dateStr;
        // if(dateStr){
        //   dateStr = this.datePipe.transform(Date.now(),ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT)??'';
        // }
        this.filterGridByFromDate(dateStr);
      }

    });
    this.loaderService.hideLoader();

    // flatpickr('#fromDate', {
    //   dateFormat: 'd/m/Y', // Adjust the date format as per your requirement
    //   defaultDate: this.fromDate,
    //   onChange: (selectedDates, dateStr, instance) => {
    //     // this.fromDt = dateStr;
    //     if(dateStr){
    //       dateStr = this.datePipe.transform(Date.now(),ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT)??'';
    //     }
    //     this.filterGridByFromDate(dateStr);
    //   }
    // });

    flatpickr('#toDate', {
      dateFormat: 'd/m/Y', // Adjust the date format as per your requirement
      defaultDate: this.toDate,
      onChange: (selectedDates, dateStr) => {
        // this.toDt = dateStr;
        // if(dateStr){
        //   dateStr = this.datePipe.transform(Date.now(),ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT)??'';
        // }
        this.filterGridByToDate(dateStr);
      }
    });
  }

  // getTotalCost() {
  //   return this.filteredDataSource.map((t: { debit: any; }) => t.debit).reduce((credit: any, value: any) => credit + value, 0);
  // }

  // getTotalDebit(): number {
  //   if (this.filteredDataSource)
  //     return this.filteredDataSource.reduce((total: any, item: any) => total + (item.Debit || 0), 0);
  //   else return 0;
  // }

  // getTotalCredit(): number {
  //   if (this.filteredDataSource)
  //     return this.filteredDataSource.reduce((total: any, item: any) => total + (item.Credit || 0), 0);
  //   else return 0;
  // }

  setTabActive(index: number) {
    this.selectedTabIndex = index;
    // this.LoadGrid();
  }

  LoadGrid() {
    this.loaderService.showLoader();
    this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(this.fromDate)
    this.formattedToDate = this.dateUtil.formatDateToMMDDYYYY(this.toDate)

    this.getExpenseList();
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
    this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(this.fromDate)
    this.formattedToDate = this.dateUtil.formatDateToMMDDYYYY(this.toDate)
    this.expenseService.getSourceOrReasonList(
      this.fromDate.toString(), this.toDate.toString(), this.sourceOrReason
    ).subscribe(
      (res) => {
        this.sourceOrReasonList = res;
        // this.LoadGrid();
      },
    )
  }

  applyFilters(all: boolean = false) {
    if (all) {
      this.getExpenseList();
    }
    this.filteredExpenseDataSource = this.expenseDataSource.filter((item: any) => {
      const searchText = item.SourceOrReason.toLowerCase().includes(this.sourceOrReason) || item.Description.toLowerCase().includes(this.sourceOrReason);
      const minAmountCondition = this.minAmount == 0 || (item.Debit !== 0 && Math.abs(item.Debit) >= this.minAmount) || (item.Credit !== 0 && Math.abs(item.Credit) >= this.minAmount);
      const maxAmountCondition = this.maxAmount == 0 || (item.Debit !== 0 && Math.abs(item.Debit) <= this.maxAmount) || (item.Credit !== 0 && Math.abs(item.Credit) <= this.maxAmount);
      return searchText && minAmountCondition && maxAmountCondition;
    });
    this.latestDate = this.getLatestExpenseDate();
    console.log('this.latestDate : ', this.latestDate);

  }

  getLatestExpenseDate(): Date {
    if (!this.filteredExpenseDataSource || this.filteredExpenseDataSource.length === 0) {
      return new Date(); // Return null if no data is available
    }
    return this.filteredExpenseDataSource[0].ExpenseDate
  }

  // hideExpense(expenseId: number) {
  //   this.onTableDataChange(1);
  //   this.filteredDataSource = this.filteredDataSource.filter((item: any) => {
  //     const includeExpense = item.ExpenseId != expenseId;
  //     return includeExpense;
  //   });
  //   this.filteredSummaryDataSource = this.filteredSummaryDataSource.filter((item: any) => {
  //     const includeExpense = item.ExpenseId != expenseId;
  //     return includeExpense;
  //   });
  // }

  onSourceOrReasonChange(valueToFilter: any) {
    this.sourceOrReason = valueToFilter.target.value.toLowerCase();
    this.getSourceOrReasonList();
    this.applyFilters();
  }

  getExpenseList() {
    this.loaderService.showLoader();
    this.expenseColumnConfiguration();
    this.filterColumns = this.expenseColumnConfig.filter((col) =>
      ['SourceOrReason', 'emailId'].includes(col.field ?? '')
    );
    this.expenseService.getExpenseList(this.formattedFromDate, this.formattedToDate, this.SpecificSourceOrReason, 0, 0, this.modeOfTransaction).subscribe((res) => {
      this.expenseDataSource = res;
      this.filteredExpenseDataSource = res;
      this.loaderService.hideLoader();

      console.log('this.filteredExpenseDataSource : ', this.filteredExpenseDataSource);

    },
    )
  }

  getExpenseListBySourceOrReason(sourceOrReason: string) {
    this.SpecificSourceOrReason = sourceOrReason;
    this.setTabActive(0);
  }

  expenseDetails(data: any) {
    this.loaderService.showLoader();
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
    this.expenseService.deleteExpense(this.expenseId).subscribe((res) => {
      if (res) {
        this.LoadGrid();
      }
    },
    );
  }
  addExpense(expense: any) {
    this.expenseService.addExpense(expense).subscribe((res) => {
      if (res) {
        this.LoadGrid();
      }
    },
    )
  }

  expenseAdjustment() {
  }


  filterGridByFromDate(date: any) {
    console.log('fromDate : ', this.fromDate);

    this.fromDate = this.dateUtil.convertDDMMYYYYToDate(date);;// this.datepipe.transform(data.value, 'MM-dd-yyyy');
    console.log('fromDate : ', this.fromDate);
    this.formattedFromDate = this.dateUtil.formatDateToMMDDYYYY(this.fromDate);
    this.getSourceOrReasonList();
    this.LoadGrid();
  }

  filterGridByToDate(date: any) {
    this.toDate = this.dateUtil.convertDDMMYYYYToDate(date);;// this.datepipe.transform(data.value, 'MM-dd-yyyy');
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
    //           this.messageInput.nativeElement.focus();
    setTimeout(() => {
      this.minInput.nativeElement.focus();
    }, 0);

    this.applyFilters();
  }

  filterGridBySource(data: any) {
    if (data.source != null && data.source != undefined) {
      this.sourceOrReason = data.source.value.toLowerCase();
    }
    else if (data.value != null && data.value != undefined) {
      this.sourceOrReason = data.source.value.toLowerCase();
    }
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);

    this.applyFilters();
  }

  filterGridByMode(data: any) {
    this.modeOfTransaction = data.value;
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
  // exportToExcel() {
  // }

  // exportGridToExcel() {
  //   this.expenseService.exportGridToExcel(this.filteredDataSource.filteredData).subscribe((res) => {
  //     if (res) {

  //     }
  //   })
  // }
  // onTableDataChange(event: any) {
  //   this.page = event;
  // }

  // itemcount(): string {
  //   const recordsPerPage = this.itemsPerPage;
  //   const totalRecords = this.filteredDataSource?.length;
  //   const currentPage = this.page;
  //   let startRecord = (currentPage - 1) * recordsPerPage + 1;
  //   startRecord = this.filteredDataSource?.length > 0 ? startRecord : 0;
  //   let endRecord = currentPage * recordsPerPage;
  //   endRecord = Math.min(endRecord, totalRecords);

  //   return startRecord + '-' + endRecord;
  // }

  // sortarr(key: string) {
  //   if (this.key === key) {
  //     if (this.reverse) {
  //       // Second click, set to ascending order
  //       this.reverse = false;
  //     } else {
  //       // First click, set to descending order
  //       this.reverse = true;
  //     }
  //   } else {
  //     // Clicking a different column, reset sorting and sorting direction
  //     this.key = key;
  //     this.reverse = false;
  //   }

  //   // Sort the data based on the column and sorting direction
  //   if (!this.reverse) {
  //     // Sort in ascending order
  //     this.filteredDataSource.sort((a: any, b: any) => {
  //       const valueA = a[key]?.toLowerCase();
  //       const valueB = b[key]?.toLowerCase();
  //       return valueA.localeCompare(valueB);
  //     });
  //   } else {
  //     // Sort in descending order
  //     this.filteredDataSource.sort((a: any, b: any) => {
  //       const valueA = a[key]?.toLowerCase();
  //       const valueB = b[key]?.toLowerCase();
  //       return valueB.localeCompare(valueA);
  //     });
  //   }

  //   this.sortClickCount++;

  //   if (this.sortClickCount === 3) {
  //     // Third click, reset data to its original order
  //     this.sortClickCount = 0; // Reset the click count
  //     this.getExpenseList();
  //   }
  // }

  // onSortClick(event: any, column: string) {
  //   const target = event.currentTarget;
  //   const classList = target.classList;

  //   if (
  //     !classList.contains('bi-arrow-up') &&
  //     !classList.contains('bi-arrow-down')
  //   ) {
  //     // First click, set to ascending order
  //     classList.add('bi-arrow-up');
  //     this.sortDir = 1;
  //   } else if (classList.contains('bi-arrow-up')) {
  //     // Second click, set to descending order
  //     classList.remove('bi-arrow-up');
  //     classList.add('bi-arrow-down');
  //     this.sortDir = -1;
  //   } else {
  //     classList.remove('bi-arrow-up', 'bi-arrow-down'); // Remove both classes
  //     this.sortDir = 0; // Reset sorting direction
  //   }

  //   this.sortarr(column); // Use the provided column parameter here
  // }

  // checkUncheckAll(e: any, page: number) {
  //   this.expenseSelected = [];
  //   this.isAllChecked = !this.isAllChecked;
  //   const currentPageRows = this.filteredDataSource.slice(
  //     (page - 1) * 10,
  //     page * 10
  //   );

  //   this.filteredDataSource.map((item: any) => {
  //     item.selected = this.isAllChecked;
  //     if (item.selected) {
  //       if (!this.expenseSelected.includes(item)) {
  //         this.expenseSelected.push(item.id);
  //       }
  //     } else {
  //       const index = this.expenseSelected.indexOf(item.id);
  //       if (index !== -1) {
  //         this.expenseSelected.splice(index, 1);
  //       }
  //     }
  //   });
  //   console.log('expenseSelected', this.expenseSelected);
  // }

  // isAllSelected(event: any, item: any, Index: number, pageIndex: number) {
  //   const currentPageRows = this.filteredDataSource.slice(
  //     (pageIndex - 1) * 10,
  //     pageIndex * 10
  //   );
  //   this.filteredDataSource[Index].selected = event.target.checked;
  //   const index = this.expenseSelected.indexOf(item.id);
  //   if (event.target.checked) {
  //     this.expenseSelected.push(item.id);
  //     this.selectedCheckboxMap[item.id] = true;
  //     this.selectedCount++;
  //   } else {
  //     this.expenseSelected.splice(index, 1);
  //     this.selectedCheckboxMap[item.id] = false;
  //     this.selectedCount--;
  //   }
  //   const currentPage = this.page;
  //   this.selectedCheckboxMap[currentPage] =
  //     this.expenseSelected.length === this.filteredDataSource.length;
  //   this.isAllChecked = this.selectedCheckboxMap[currentPage];
  // }

  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.page = 1; // Reset to the first page
    this.applyFilters();
  }
  // updateDisplayedData() {
  //   const startIndex = (this.page - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.filteredDataSource = this.filteredexpenseDataSource.slice(startIndex, endIndex);
  // }


}


