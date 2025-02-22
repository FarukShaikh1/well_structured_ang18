import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { ApplicationConstants, ApplicationTableConstants, DBConstants } from '../../../utils/application-constants';
import { TableUtils } from '../../../utils/table-utils';
import { DayService } from '../../services/day/day.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { DayDetailsComponent } from '../day-details/day-details.component';
import { TabulatorGridComponent } from '../shared/tabulator-grid/tabulator-grid.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

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
  imports: [TabulatorGridComponent, CommonModule, DayDetailsComponent],
  providers: [DatePipe]
})

export class DayComponent implements OnInit {
  // Handle "Select All" checkbox
  toggleAllMonthCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedMonths = checked ? this.monthList.map((m: any) => m.listItemName) : [];

    this.getMonthDropdownLabel()
    this.applyFilters();
  }
  // Handle individual month selection
  toggleMonthCheck(event: Event, monthName: string) {
    const checked = (event.target as HTMLInputElement).checked;
    debugger;
    if (checked) {
      this.selectedMonths.push(monthName);
    } else {
      this.selectedMonths = this.selectedMonths.filter(m => m !== monthName);
    }
    this.getMonthDropdownLabel()
    this.applyFilters()
  }
  getMonthDropdownLabel() {
    if (this.selectedMonths.length === 0) {
      this.lableForMonthDropDown = 'Select Months'
    } else if (this.selectedMonths.length === this.monthList.length) {
      this.lableForMonthDropDown = "All";
    } else {
      this.lableForMonthDropDown = this.selectedMonths.join(", ");
    }
  }
  getDayTypeDropdownLabel() {
    if (this.selectedDayType.length === 0) {
      this.lableForDayTypeDropDown = 'Select DayTypes'
    } else if (this.selectedDayType.length === this.dayTypeList.length) {
      this.lableForDayTypeDropDown = "All";
    } else {
      this.lableForDayTypeDropDown = this.selectedDayType.join(", ");
    }
  }
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('typeInput', { static: true }) typeInput: any;
  @ViewChild('monthInput', { static: true }) monthInput: any;
  @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(DayDetailsComponent)
  dayDetailsComponent!: DayDetailsComponent;
  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;

  public tableData: Record<string, unknown>[] = [];
  public filteredTableData: Record<string, unknown>[] = [];
  public tableColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE; // Set default pagination size
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];

  monthList: any;
  dayTypeList: any = '';
  month: any = '';
  selectedDayTypeIds: any = '';
  dayType: any = '';
  isToday: boolean = false;
  isTomorrow: boolean = false;
  isYesterday: boolean = false;
  daySelected: number[] = [];
  searchText: string = '';
  selectedData!: { value: any; text: any; };
  lableForMonthDropDown = 'Select Months'
  selectedMonths: string[] = [];  // Array to store selected months
  DayType: string[] = [];  // Array to store selected months
  lableForDayTypeDropDown = 'Select DayTypes'
  selectedDayType: string[] = [];  // Array to store selected DayTypes

  constructor(private _dayService: DayService, private _globalService: GlobalService,
    private _httpClient: HttpClient, public tableUtils: TableUtils,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    public datePipe: DatePipe,
    private router: Router
  ) {
    this._httpClient.get(_globalService.getCommonListItems(DBConstants.MONTH)).subscribe(res => {
      this.monthList = res;
    });

    this._httpClient.get(_globalService.getCommonListItems(DBConstants.DAYTYPE)).subscribe(res => {
      this.dayTypeList = res;
    });

  }


  ngOnInit() {
    this.loaderService.showLoader()
    this.columnConfiguration();
    // Define which columns are available for filtering
    this.filterColumns = this.tableColumnConfig.filter((col) =>
      ['personName', 'emailId'].includes(col.field ?? '')
    );

    this.getDayList();
  }
  getDayList() {
    this._dayService.getDayList(this.month, this.dayType, this.searchText, this.isToday, this.isTomorrow, this.isYesterday).subscribe(
      {
        next: (res: any) => {
          this.tableData = res.data;
          this.filteredTableData = res.data;
          console.log('this.filteredTableData : ', this.filteredTableData);
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }

  columnConfiguration() {
    this.tableColumnConfig = [
      {
        title: 'Birth date',
        field: 'birthdate',
        sorter: 'alphanum',
        maxWidth: 100,
        formatter: this.dateFormatter.bind(this),
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
      {
        title: 'Email Id',
        field: 'emailId',
        sorter: 'alphanum',
      },
      {
        title: 'Mobile Number',
        field: 'mobileNumber',
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
        field: 'assetId',
        formatter: this.picFormatter.bind(this),
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
         ${clientData['personName']}
      </button>
    `;
    return html;
  }

  picFormatter(cell: CellComponent) {
    const clientData = cell.getRow().getData();
    const clientId = clientData['assetId'];
    if (clientId) {
      const html = `
      <img src="../../">
   `;
      return html;
    }
    const html = ''
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
  dateFormatter(cell: CellComponent) {
    const columnName = cell.getColumn().getField();
    const projectData = cell.getRow().getData();
    const dateColumn = projectData[columnName];
    if (dateColumn) {
      return `<span>${this.datePipe.transform(
        dateColumn,
        'dd-MMM'
      )}</span>`;
    }
    const nullDate = '';
    return `<span>${nullDate}</span>`;
  }

  openPopup() {
    console.log('dayDetails clicked');
    this.dayDetailsComponent.openDetailsPopup();

  }

  hideDay(BirthdayId: number) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
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

    // this.getDayList();
  }

  filterGridByType() {
    this.applyFilters();

  }

  filterGridSearchText(event: any) {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);

    this.searchText = event.target.value.toLowerCase();
    this.applyFilters();

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

  // updateAllComplete() {
  //   this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);

  //   this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
  //   this.isYesterday = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
  //   this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);
  //   if (this.searchInput) {
  //     this.searchInput.nativeElement.value = '';
  //   }
  //   if (this.monthInput) {
  //     // this.selectedMonths = '';
  //     this.monthInput.value = [];
  //   }
  //   if (this.typeInput) {
  //     this.selectedDayTypeIds = '';
  //     this.typeInput.value = [];
  //   }

  //   this.getDayList();

  // }

  someComplete(): boolean {
    this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
    this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
    this.isYesterday = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);

    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  // setAll(completed: boolean) {
  //   if (this.searchInput) {
  //     this.searchInput.nativeElement.value = '';
  //   }
  //   if (this.monthInput) {
  //     // this.selectedMonths = '';
  //     this.monthInput.value = [];
  //   }
  //   if (this.typeInput) {
  //     this.selectedDayTypeIds = '';
  //     this.typeInput.value = [];
  //   }

  //   this.allComplete = completed;
  //   if (this.task.subtasks == null) {
  //     return;
  //   }
  //   this.task.subtasks.forEach(t => (t.completed = completed));
  //   this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
  //   this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
  //   this.isYesterday = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);

  //   this.getDayList();
  // }

  applyFilters() {
    console.log('this.tableData : ', this.tableData);

    this.filteredTableData = this.tableData.filter((item: any) => {
      const matchesName = item.personName?.toLowerCase().includes(this.searchText);
      const email = item.emailId?.toLowerCase().includes(this.searchText);
      const address = item.address?.toLowerCase().includes(this.searchText);
      const dayType = item.type?.toLowerCase().includes(this.searchText);
      const date = item.date?.toLowerCase().includes(this.searchText);
      const mobileNumber = item.mobileNumber?.toLowerCase().includes(this.searchText);
      // Check if item's month exists in selectedMonths
      const matchesMonth = this.selectedMonths.length === 0 || this.selectedMonths.includes(item.month);
      const matchesDayType = this.selectedDayType.length === 0 || this.selectedDayType.includes(item.DayType);
      // const matchesType = this.selectedDayTypeIds.length === 0 || this.selectedDayTypeIds.includes(item.dayTypeId);
      // return matchesName && matchesMonth && matchesType;
      return (matchesName || email || address || dayType || date || mobileNumber) && matchesMonth;
    });
  }

}
