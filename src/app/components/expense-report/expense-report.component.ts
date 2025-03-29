import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import flatpickr from 'flatpickr';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { ApplicationConstants, ApplicationTableConstants, NavigationURLs } from '../../../utils/application-constants';
import { ExpenseService } from '../../services/expense/expense.service';
import { ExpenseDetailsComponent } from '../expense-details/expense-details.component';
import { TabulatorGridComponent } from '../shared/tabulator-grid/tabulator-grid.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-expense-report',
  standalone:true,
  imports:[CommonModule,TabulatorGridComponent,ExpenseDetailsComponent],
  templateUrl: './expense-report.component.html',
  providers: [DatePipe],
  styleUrls: ['./expense-report.component.scss']
})

export class ExpenseReportComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef | undefined;
  @ViewChild('minInput', { static: true }) minInput: any;
  @ViewChild('maxInput', { static: true }) maxInput: any;
    @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(ExpenseDetailsComponent)
  expenseDetailsComponent!: ExpenseDetailsComponent;
  
  public tableData: Record<string, unknown>[] = [];
  public filteredTableData: Record<string, unknown>[] = [];
  public tableColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE; // Set default pagination size
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];
  public dateFormat = ApplicationConstants.GLOBAL_DATE_FORMAT;
  
  index: number = 0;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
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
  optionsMenu = [
    {
      label: `<a class="dropdown-item btn-link">
                  <i class="bi bi-eye"></i>
                    &nbsp;View
                  </a>
                  `,
      action: (_e: any, cell: CellComponent) => {
        const expenseData = cell.getRow().getData();
        const sourceOrReason = expenseData["sourceOrReason"];
        const firstDate = expenseData["firstDate"];
        const lastDate = expenseData["lastDate"];
        this.expenseList(sourceOrReason,firstDate,lastDate);
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


  constructor(private expenseService: ExpenseService, 
    private router: Router,
    
    public datePipe: DatePipe,
  ) {
    // this._httpClient.get(_globalService.getCommonListItems(API_URL.MODEOFTRANSACTION)).subscribe(res => {
    //   this.modeOfTransactionList = res;
    // });
  }

  ngOnInit() {

    this.reportColumnConfiguration();
    this.fromDate.setDate(this.toDate.getDate() - 62);
    // this.fromDt = this.datepipe.transform(this.fromDate, 'dd/MM/yyyy');
    // this.toDt = this.datepipe.transform(this.toDate, 'dd/MM/yyyy');
    this.getSourceOrReasonList();
    this.LoadGrid();
  }

    goToExpenseList() {
      this.router.navigate([NavigationURLs.EXPENSE_LIST]);
    }
    goToExpenseSummary() {
      this.router.navigate([NavigationURLs.EXPENSE_SUMMARY_LIST]);
    }
  
  reportColumnConfiguration(){
    this.tableColumnConfig = [
      {
        title: 'FirstDate',
        field: 'firstDate',
        sorter: 'alphanum',
        width:100,
        formatter: this.uploadedDateFormatter.bind(this),
      },
      {
        title: 'LastDate',
        field: 'lastDate',
        sorter: 'alphanum',
        width:100,
        formatter: this.uploadedDateFormatter.bind(this),
      },
      {
        title: 'Source/Reason',
        field: 'sourceOrReason',
        sorter: 'alphanum',
        width:150,
      },
      {
        title: 'Description',
        field: 'description',
        sorter: 'alphanum',
        width:600,
        formatter: (cell) => {
          const value = cell.getValue() || "";
          return `<div class="text-wrap">${value}</div>`;
        },
        cssClass: "description-column",
      },
      {
        title: 'TakenAmount',
        field: 'takenAmount',
        sorter: 'alphanum',
        width:100,
      },
      {
        title: 'GivenAmount',
        field: 'givenAmount',
        sorter: 'alphanum',
        width:100,
      },
      {
        title: 'TotalAmount',
        field: 'totalAmount',
        sorter: 'alphanum',
        width:100,
      },
      {
        title: "-",
        field: "",
        maxWidth: 70,
        formatter: this.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const expenseId = cell.getRow().getData()["sourceOrReason"];
          this.hideExpense(expenseId); // Call the hideExpense method
        },
        headerSort: false,
      },
      {
        title: "",
        field: "",
        maxWidth: 70,
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
      return item.sourceOrReason != expenseId;
    });
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
      onChange: (selectedDates, dateStr) => {
        // this.fromDt = dateStr;
        this.filterGridByFromDate(dateStr);
      }
    });

    flatpickr('#toDate', {
      dateFormat: 'd/m/Y', // Adjust the date format as per your requirement
      defaultDate: this.toDate,
      onChange: (selectedDates, dateStr) => {
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

  getTotalTakenAmount(): number {
    if (this.filteredTableData)
      return this.filteredTableData.reduce((total: any, item: any) => total + (item.TakenAmount || 0), 0);
    else return 0;
  }

  getTotalGivenAmount(): number {
    if (this.filteredTableData)
      return this.filteredTableData.reduce((total: any, item: any) => total + (item.GivenAmount || 0), 0);
    else return 0;
  }
  getTotalTotalAmount(): number {
    if (this.filteredTableData)
      return this.filteredTableData.reduce((total: any, item: any) => total + (item.TotalAmount || 0), 0);
    else return 0;
  }

  setTabActive(index: number) {
    this.selectedTabIndex = index;
    // this.LoadGrid();
  }

  LoadGrid() {
    this.fromDt = this.formatDateToMMDDYYYY(this.fromDate)
    this.toDt = this.formatDateToMMDDYYYY(this.toDate)
    this.getExpenseReportList();
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
      this.getExpenseReportList();
    }
    this.filteredTableData = this.tableData.filter((item: any) => {
      const searchText = item.sourceOrReason.toLowerCase().includes(this.sourceOrReason) || item.description.toLowerCase().includes(this.sourceOrReason);
      const minAmountCondition = this.minAmount == 0 || (item.debit !== 0 && Math.abs(item.debit) >= this.minAmount) || (item.credit !== 0 && Math.abs(item.credit) >= this.minAmount);
      const maxAmountCondition = this.maxAmount == 0 || (item.debit !== 0 && Math.abs(item.debit) <= this.maxAmount) || (item.credit !== 0 && Math.abs(item.credit) <= this.maxAmount);
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

  getExpenseReportList() {
    this.expenseService.getExpenseReportList(this.fromDt, this.toDt, '', 0, 0, this.modeOfTransaction).subscribe((res) => {
      this.tableData = res;
      this.filteredTableData = res;
      console.log('this.filteredReportDataSource : ',this.filteredTableData);
    },
    )
  }


  getExpenseListBySourceOrReason(sourceOrReason: string) {
    this.SpecificSourceOrReason = sourceOrReason;
    this.setTabActive(0);
  }

  expenseList(sourceOrReason: string,firstDate:string, lastDate:string) {
    console.log('expenseDetails clicked');
    
    this.router.navigate([NavigationURLs.EXPENSE_LIST],
      {
        queryParams: { sourceOrReason: sourceOrReason, firstDate:firstDate, lastDate:lastDate }
      }
    );
  }

  expenseDetails(data: any) {
    this.expenseDetailsComponent.openDetailsPopup(data);
  }

  deleteExpense(data: number) {
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


