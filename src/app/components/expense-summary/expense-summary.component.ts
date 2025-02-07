import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import flatpickr from 'flatpickr';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { ApplicationConstants, ApplicationTableConstants } from '../../../utils/application-constants';
import { ExpenseService } from '../../services/expense/expense.service';
import { GlobalService } from '../../services/global/global.service';
import { TabulatorGridComponent } from '../shared/tabulator-grid/tabulator-grid.component';
import { ExpenseDetailsComponent } from '../expense-details/expense-details.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-expense-summary',
  standalone:true,
  imports:[CommonModule,TabulatorGridComponent,ExpenseDetailsComponent],
  templateUrl: './expense-summary.component.html',
  providers: [DatePipe],
  styleUrls: ['./expense-summary.component.scss']
})

export class ExpenseSummaryComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef | undefined;
  @ViewChild('minInput', { static: true }) minInput: any;
  @ViewChild('maxInput', { static: true }) maxInput: any;
    @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(ExpenseDetailsComponent)
  expenseDetailsComponent!: ExpenseDetailsComponent;
  
  public tableData: Record<string, unknown>[] = [];
  public expenseColumnConfig: ColumnDefinition[] = [];
  public summaryColumnConfig: ColumnDefinition[] = [];
  public reportColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE; // Set default pagination size
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];
  public dateFormat = ApplicationConstants.GLOBAL_DATE_FORMAT;
  
  index: number = 0;
  summaryDataSource!: any;
  filteredSummaryDataSource!: any;
  fromDate = new Date();
  toDate = new Date();
  fromDt: any;
  toDt: any;
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


  constructor(private expenseService: ExpenseService, private _httpClient: HttpClient,
    private _globalService: GlobalService, private sanitizer: DomSanitizer,
    public datePipe: DatePipe,
  ) {
    // this._httpClient.get(_globalService.getCommonListItems(constants.MODEOFTRANSACTION)).subscribe(res => {
    //   this.modeOfTransactionList = res;
    // });
  }

  ngOnInit() {

    this.fromDate.setDate(this.toDate.getDate() - 62);
    // this.fromDt = this.datepipe.transform(this.fromDate, 'dd/MM/yyyy');
    // this.toDt = this.datepipe.transform(this.toDate, 'dd/MM/yyyy');
    this.getSourceOrReasonList();
    this.LoadGrid();
  }
  expenseColumnConfiguration(){
    this.expenseColumnConfig = [
      {
        title: 'Expense Date',
        field: 'ExpenseDate',
        sorter: 'alphanum',
        formatter: this.uploadedDateFormatter.bind(this),
      },
      {
        title: 'Source/Reason',
        field: 'SourceOrReason',
        sorter: 'alphanum',
      },
      {
        title: 'Description',
        field: 'Description',
        sorter: 'alphanum',
        width:400,
      },
      {
        title: 'ModeOfTransaction',
        field: 'ModeOfTransaction',
        sorter: 'alphanum',
      },
      {
        title: 'Debit',
        field: 'Debit',
        sorter: 'alphanum',
      },
      {
        title: 'Credit',
        field: 'Credit',
        sorter: 'alphanum',
      },
    ];
  }

  summaryColumnConfiguration(){
    this.summaryColumnConfig = [
      {
        title: 'Expense Date',
        field: 'ExpenseDate',
        sorter: 'alphanum',
        formatter: this.uploadedDateFormatter.bind(this),
      },
      {
        title: 'Source/Reason',
        field: 'SourceOrReason',
        sorter: 'alphanum',
      },
      {
        title: 'SBI Account',
        field: 'SbiAccount',
        sorter: 'alphanum',
      },
      {
        title: 'CBI Account',
        field: 'CbiAccount',
        sorter: 'alphanum',
      },
      {
        title: 'Cash Account',
        field: 'Cash',
        sorter: 'alphanum',
      },
      {
        title: 'Other Account',
        field: 'Other',
        sorter: 'alphanum',
      },
      {
        title: 'Total',
        field: 'Total',
        sorter: 'alphanum',
      },
      {
        title: 'SbiBalance',
        field: 'SbiBalance',
        sorter: 'alphanum',
      },
      {
        title: 'CashBalance',
        field: 'CashBalance',
        sorter: 'alphanum',
      },
      {
        title: 'CbiBalance',
        field: 'CbiBalance',
        sorter: 'alphanum',
      },
      {
        title: 'OtherBalance',
        field: 'OtherBalance',
        sorter: 'alphanum',
      },
      {
        title: 'TotalAvailable',
        field: 'TotalAvailable',
        sorter: 'alphanum',
      },
      {
        title: '',
        field: '',
        sorter: 'alphanum',
      },
    ];
  }

  reportColumnConfiguration(){
    this.reportColumnConfig = [
      {
        title: 'FirstDate',
        field: 'FirstDate',
        sorter: 'alphanum',
        formatter: this.uploadedDateFormatter.bind(this),
      },
      {
        title: 'LastDate',
        field: 'LastDate',
        sorter: 'alphanum',
        formatter: this.uploadedDateFormatter.bind(this),
      },
      {
        title: 'Source/Reason',
        field: 'SourceOrReason',
        sorter: 'alphanum',
      },
      {
        title: 'Description',
        field: 'Description',
        sorter: 'alphanum',
      },
      {
        title: 'TakenAmount',
        field: 'TakenAmount',
        sorter: 'alphanum',
      },
      {
        title: 'GivenAmount',
        field: 'GivenAmount',
        sorter: 'alphanum',
      },
      {
        title: 'TotalAmount',
        field: 'TotalAmount',
        sorter: 'alphanum',
      },
      {
        title: '',
        field: '',
        sorter: 'alphanum',
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
        this.dateFormat
      )}</span>`;
    }
    const nullDate = '';
    return `<span>${nullDate}</span>`;
  }


  formatDateToMMDDYYYY(date: Date): string {
    const mm = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const dd = ('0' + date.getDate()).slice(-2);
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
  ngAfterViewInit() {
    flatpickr('#fromDate', {
      dateFormat: 'd/m/Y', // Adjust the date format as per your requirement
      defaultDate: this.fromDate,
      onChange: (selectedDates, dateStr, instance) => {
        // this.fromDt = dateStr;
        this.filterGridByFromDate(dateStr);
      }
    });

    flatpickr('#toDate', {
      dateFormat: 'd/m/Y', // Adjust the date format as per your requirement
      defaultDate: this.toDate,
      onChange: (selectedDates, dateStr, instance) => {
        // this.toDt = dateStr;
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

  getTotalSbiAccount(): number {
    if (this.filteredSummaryDataSource)
      return this.filteredSummaryDataSource.reduce((total: any, item: any) => total + (item.SbiAccount || 0), 0);
    else return 0;
  }
  getTotalCbiAccount(): number {
    if (this.filteredSummaryDataSource)
      return this.filteredSummaryDataSource.reduce((total: any, item: any) => total + (item.CbiAccount || 0), 0);
    else return 0;
  }
  getTotalCash(): number {
    if (this.filteredSummaryDataSource)
      return this.filteredSummaryDataSource.reduce((total: any, item: any) => total + (item.Cash || 0), 0);
    else return 0;
  }
  getTotalOther(): number {
    if (this.filteredSummaryDataSource)
      return this.filteredSummaryDataSource.reduce((total: any, item: any) => total + (item.Other || 0), 0);
    else return 0;
  }

  setTabActive(index: number) {
    this.selectedTabIndex = index;
    // this.LoadGrid();
  }

  LoadGrid() {
    this.fromDt = this.formatDateToMMDDYYYY(this.fromDate)
    this.toDt = this.formatDateToMMDDYYYY(this.toDate)
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
    this.fromDt = this.formatDateToMMDDYYYY(this.fromDate)
    this.toDt = this.formatDateToMMDDYYYY(this.toDate)
    this.expenseService.getSourceOrReasonList(
      this.fromDt, this.toDt, this.sourceOrReason
    ).subscribe(
      (res) => {
        this.sourceOrReasonList = res;
        // this.LoadGrid();
      },
    )
  }

  applyFilters(all: boolean = false) {
    if (all) {
      this.getExpenseSummaryList();
    }
    this.filteredSummaryDataSource = this.summaryDataSource.filter((item: any) => {
      const searchText = item.SourceOrReason.toLowerCase().includes(this.sourceOrReason) || item.Description.toLowerCase().includes(this.sourceOrReason);
      const minAmountCondition = this.minAmount == 0 || (item.Debit !== 0 && Math.abs(item.Debit) >= this.minAmount) || (item.Credit !== 0 && Math.abs(item.Credit) >= this.minAmount);
      const maxAmountCondition = this.maxAmount == 0 || (item.Debit !== 0 && Math.abs(item.Debit) <= this.maxAmount) || (item.Credit !== 0 && Math.abs(item.Credit) <= this.maxAmount);
      return searchText && minAmountCondition && maxAmountCondition;
    });
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


  getExpenseSummaryList() {
    this.summaryColumnConfiguration();
    this.expenseService.getExpenseSummaryList(this.fromDt, this.toDt, '', 0, 0, this.modeOfTransaction).subscribe((res) => {
      this.summaryDataSource = res;
      this.filteredSummaryDataSource = res;
      console.log('this.filteredSummaryDataSource : ',this.filteredSummaryDataSource);
    },
    )
  }


  getExpenseListBySourceOrReason(sourceOrReason: string) {
    this.SpecificSourceOrReason = sourceOrReason;
    this.setTabActive(0);
  }

  expenseDetails(data: any) {
    console.log('expenseDetails clicked');
    
      this.expenseDetailsComponent.openDetailsPopup(data);
  }


  deleteExpense(data: number) {
  }

  addExpense(expense: any, item: any) {
    this.expenseService.addExpense(expense).subscribe((res) => {
      if (res) {
        this.LoadGrid();
      }
    },
    )
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
    this.fromDt = this.formatDateToMMDDYYYY(this.fromDate);
    this.getSourceOrReasonList();
    this.LoadGrid();
  }

  filterGridByToDate(date: any) {
    this.toDate = this.convertDDMMYYYYToDate(date);;// this.datepipe.transform(data.value, 'MM-dd-yyyy');
    this.toDt = this.formatDateToMMDDYYYY(this.toDate);
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


