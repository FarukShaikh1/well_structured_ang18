import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { ApplicationTableConstants } from '../../../utils/application-constants';
import { TableUtils } from '../../../utils/table-utils';
import { DayService } from '../../services/day/day.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { DayDetailsComponent } from '../day-details/day-details.component';
import { TabulatorGridComponent } from '../shared/tabulator-grid/tabulator-grid.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-day',
  standalone: true,
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  imports: [TabulatorGridComponent, CommonModule, DayDetailsComponent]
})

export class DayComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef | undefined;
  @ViewChild('typeInput', { static: true }) typeInput: any;
  @ViewChild('monthInput', { static: true }) monthInput: any;
  @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(DayDetailsComponent)
  dayDetailsComponent!: DayDetailsComponent;
  public tableData: Record<string, unknown>[] = [];
  public columnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE; // Set default pagination size
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];

  index: number = 0;
  dataSource!: any;
  filteredDataSource!: any;

  monthList: any;
  dayTypeList: any = '';
  month: any = '';
  selectedMonths: any = '';
  selectedDayTypeIds: any = '';
  dayType: any = '';
  isToday: boolean = false;
  isTomorrow: boolean = false;
  isYesterday: boolean = false;
  daySelected: number[] = [];
  searchText: string = '';
  selectedData!: { value: any; text: any; };
  selectedCount: number = 0;
  key: string = 'archiveAdminData.name';
  reverse: boolean = false;
  isAllChecked: boolean = false;
  sortDir = 1;
  sortClickCount = 0;
  selectedCheckboxMap: { [key: number]: boolean } = {};
  page: number = 1;
  count: number = 0;
  itemCountList: string = '';
  pageSizeOptions = [10, 15, 20, 50, 100, 500, 1000];
  itemsPerPage = 10;

  constructor(private _dayService: DayService, private _globalService: GlobalService,
    private _httpClient: HttpClient, public tableUtils: TableUtils,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private router: Router
  ) {
    // this._httpClient.get(_globalService.getCommonListItems(constants.MONTH)).subscribe(res => {
    //   this.monthList = res;
    // });

    // this._httpClient.get(_globalService.getCommonListItems(constants.DAYTYPE)).subscribe(res => {
    //   this.dayTypeList = res;
    // });

  }


  ngOnInit() {
    this.loaderService.showLoader()
    this.itemCountList = this.itemcount();
    console.log(' this.itemCountList :', this.itemCountList);
    this.columnConfiguration();
    // Define which columns are available for filtering
    this.filterColumns = this.columnConfig.filter((col) =>
      ['personName', 'emailId'].includes(col.field ?? '')
    );

    this.getDayList();
  }
  getDayList() {
    this._dayService.getDayList(this.month, this.dayType, this.searchText, this.isToday, this.isTomorrow, this.isYesterday).subscribe(
      {
        next: (res: any) => {
          this.dataSource = res.data;
          this.filteredDataSource = res.data;
          console.log('this.filteredDataSource : ', this.filteredDataSource);
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }

  columnConfiguration() {
    this.columnConfig = [
      {
        title: 'Birth date',
        field: 'birthdate',
        sorter: 'alphanum',
      },
      {
        title: 'Person Name',
        field: 'personName',
        sorter: 'alphanum',
      },
      {
        title: 'Email Id',
        field: 'emailId',
        sorter: 'alphanum',
      },
      {
        title: 'Address',
        field: 'address',
        sorter: 'alphanum',
      },
      {
        title: 'Type',
        field: 'type',
        sorter: 'alphanum',
      },
      {
        title: 'Pic',
        field: 'pic',
        sorter: 'alphanum',
      },
      {
        title: 'Person Name',
        titleFormatter(_cell, _formatterParams, onRendered) {
          onRendered(() => { });
          return `
            <div class="client-name-header">
              Person Name
            </div>
          `;
        },

        field: 'personName',
        sorter: 'string',
        formatter: this.personNameFormatter.bind(this),
      },

      // {
      //   title: '',
      //   field: 'options',
      //   maxWidth: 50,
      //   formatter: (_cell) =>
      //     '<button class="action-buttons" title="More Actions" style="padding-right:100px;"><i class="bi bi-three-dots btn-link"></i></button>',
      //   clickMenu: this.optionsMenu,
      //   hozAlign: 'left',
      //   headerSort: false,
      // },
    ];
  }
  personNameFormatter(cell: CellComponent) {
    const clientData = cell.getRow().getData();
    const clientId = clientData['id'];
    const html = `
       <button class="text-link view-projects-btn" data-client-id="${clientId}">
         ${clientData['name']}
      </button>
    `;
    return html;
  }

  optionsMenu = [
    {
      label: `<a class="dropdown-item btn-link"
              data-bs-toggle="modal" data-bs-target="#clientDetailsPopup">
                  <i class="bi bi-pencil"></i>
                    &nbsp;Edit
                  </a>
                  `,
      action: (_e: any, cell: CellComponent) => {
        const clientData = cell.getRow().getData();
        const clientId = clientData['id'];
        this.openPopup();
      },
    },
    {
      separator: true,
    },
    //  {
    //      label: `
    //<a class="btn-link"
    //  style="color: #67686B; padding: 5px">
    //    <i class="bi bi-trash"></i>
    //        &nbsp;Deactivate
    //</a>`,
    //      action: (_e: any, cell: CellComponent) => {
    //          const clientData = cell.getRow().getData();
    //          const clientId = clientData['id'];
    //          this.deactivateClient(clientId);
    //      }
    //  },
  ];

  openPopup() {
    console.log('dayDetails clicked');
    this.dayDetailsComponent.openDetailsPopup();

  }

  hideDay(BirthdayId: number) {
    this.onTableDataChange(1);
    this.filteredDataSource = this.filteredDataSource.filter((item: any) => {
      const includeDay = item.BirthdayId != BirthdayId;
      return includeDay;
    });
  }

  approveDay(dayId: number) {
  }



  deleteDay(dayId: number) {
  }

  addDay(day: any, item: any) {
    this._dayService.addDay(day).subscribe((res) => {
      if (res) {
        this.getDayList();
      }
    },
    )
  }


  filterGridByMonth() {
    this.applyFilters();
    this.itemcount();
    // this.getDayList();
  }

  filterGridByType() {
    this.applyFilters();
    this.itemcount();
  }

  filterGridSearchText(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.applyFilters();
    this.itemcount();
  }

  task: Task = {
    name: 'Show all records',
    completed: false,
    subtasks: [
      { name: 'Today', completed: false },
      { name: 'Yesterday', completed: false },
      { name: 'Tomorrow', completed: false },
    ],
  };
  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);

    this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
    this.isYesterday = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
    this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    if (this.monthInput) {
      this.selectedMonths = '';
      this.monthInput.value = [];
    }
    if (this.typeInput) {
      this.selectedDayTypeIds = '';
      this.typeInput.value = [];
    }

    this.getDayList();

  }

  someComplete(): boolean {
    this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
    this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
    this.isYesterday = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);

    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    if (this.monthInput) {
      this.selectedMonths = '';
      this.monthInput.value = [];
    }
    if (this.typeInput) {
      this.selectedDayTypeIds = '';
      this.typeInput.value = [];
    }

    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
    this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
    this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
    this.isYesterday = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);

    this.getDayList();
  }

  itemcount(): string {
    const recordsPerPage = this.itemsPerPage;
    const totalRecords = this.filteredDataSource?.length;
    const currentPage = this.page;
    let startRecord = (currentPage - 1) * recordsPerPage + 1;
    startRecord = this.filteredDataSource?.length > 0 ? startRecord : 0;
    let endRecord = currentPage * recordsPerPage;
    endRecord = Math.min(endRecord, totalRecords);

    return startRecord + '-' + endRecord;
  }

  sortarr(key: string) {
    if (this.key === key) {
      if (this.reverse) {
        this.reverse = false;
      } else {
        this.reverse = true;
      }
    } else {
      this.key = key;
      this.reverse = false;
    }

    if (!this.reverse) {
      this.dataSource.sort((a: any, b: any) => {
        const valueA = a[key]?.toLowerCase();
        const valueB = b[key]?.toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      this.dataSource.sort((a: any, b: any) => {
        const valueA = a[key]?.toLowerCase();
        const valueB = b[key]?.toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    this.sortClickCount++;

    if (this.sortClickCount === 3) {
      this.sortClickCount = 0;
      this.getDayList();
    }
  }

  onSortClick(event: any, column: string) {
    const target = event.currentTarget;
    const classList = target.classList;

    if (
      !classList.contains('bi-arrow-up') &&
      !classList.contains('bi-arrow-down')
    ) {
      classList.add('bi-arrow-up');
      this.sortDir = 1;
    } else if (classList.contains('bi-arrow-up')) {
      classList.remove('bi-arrow-up');
      classList.add('bi-arrow-down');
      this.sortDir = -1;
    } else {
      classList.remove('bi-arrow-up', 'bi-arrow-down');
      this.sortDir = 0;
    }

    this.sortarr(column);
  }

  checkUncheckAll(e: any, page: number) {
    this.daySelected = [];
    this.isAllChecked = !this.isAllChecked;
    const currentPageRows = this.dataSource.slice(
      (page - 1) * 10,
      page * 10
    );

    this.dataSource.map((item: any) => {
      item.selected = this.isAllChecked;
      if (item.selected) {
        if (!this.daySelected.includes(item)) {
          this.daySelected.push(item.id);
        }
      } else {
        const index = this.daySelected.indexOf(item.id);
        if (index !== -1) {
          this.daySelected.splice(index, 1);
        }
      }
    });
    console.log('daySelected', this.daySelected);
  }

  isAllSelected(event: any, item: any, Index: number, pageIndex: number) {
    const currentPageRows = this.dataSource.slice(
      (pageIndex - 1) * 10,
      pageIndex * 10
    );
    this.dataSource[Index].selected = event.target.checked;
    const index = this.daySelected.indexOf(item.id);
    if (event.target.checked) {
      this.daySelected.push(item.id);
      this.selectedCheckboxMap[item.id] = true;
      this.selectedCount++;
    } else {
      this.daySelected.splice(index, 1);
      this.selectedCheckboxMap[item.id] = false;
      this.selectedCount--;
    }
    const currentPage = this.page;
    this.selectedCheckboxMap[currentPage] =
      this.daySelected.length === this.dataSource.length;
    this.isAllChecked = this.selectedCheckboxMap[currentPage];
  }

  onTableDataChange(event: any) {
    this.page = event;
  }
  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.page = 1;
    this.applyFilters();
  }
  updateDisplayedData() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredDataSource = this.filteredDataSource.slice(startIndex, endIndex);
  }
  applyFilters() {
    this.onTableDataChange(1);
    this.filteredDataSource = this.dataSource.filter((item: any) => {
      const matchesName = item.PersonName.toLowerCase().includes(this.searchText);
      const matchesMonth = (this.selectedMonths.length === 0 || this.selectedMonths.includes(new Date(item.Birthdate).getMonth() + 1));
      const matchesType = this.selectedDayTypeIds.length === 0 || this.selectedDayTypeIds.includes(item.DayTypeId);
      return matchesName && matchesMonth && matchesType;
    });
  }

}
