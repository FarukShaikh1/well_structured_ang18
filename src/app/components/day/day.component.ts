import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CellComponent, ColumnDefinition } from "tabulator-tables";
import { API_URL } from "../../../utils/api-url";
import {
  ApplicationConstants,
  ApplicationModules,
  ApplicationTableConstants,
  DBConstants
} from "../../../utils/application-constants";
import { DayService } from "../../services/day/day.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { LocalStorageService } from "../../services/local-storage/local-storage.service";
import { DayDetailsComponent } from "../day-details/day-details.component";
import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { ToasterComponent } from "../shared/toaster/toaster.component";

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: "app-day",
  standalone: true,
  templateUrl: "./day.component.html",
  styleUrls: ["./day.component.scss"],
  imports: [TabulatorGridComponent, CommonModule, DayDetailsComponent, ConfirmationDialogComponent, ToasterComponent],
  providers: [DatePipe],
})
export class DayComponent implements OnInit {
  @ViewChild("searchInput") searchInput!: ElementRef;
  @ViewChild("typeInput", { static: true }) typeInput: any;
  @ViewChild("monthInput", { static: true }) monthInput: any;
  @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(DayDetailsComponent)
  dayDetailsComponent!: DayDetailsComponent;
  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;

  public tableData: Record<string, unknown>[] = [];
  public filteredTableData: Record<string, unknown>[] = [];
  public tableColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];

  monthList: any;
  dayTypeList: any = "";
  relationTypeList: any = "";
  isToday: boolean = false;
  isTomorrow: boolean = false;
  isYesterday: boolean = false;
  daySelected: number[] = [];
  searchText: string = "";
  lableForMonthDropDown = "";
  lableForMonthDropDownIds = "";
  selectedMonths: string[] = []; // Array to store selected months
  selectedMonthsIds: number[] = []; // Array to store selected months
  lableForDayTypeDropDown = "";
  lableForDayTypeDropDownIds = "";
  lableForRelationTypeDropDown = "";
  lableForRelationTypeDropDownIds = "";
  selectedDayType: string[] = []; // Array to store selected DayTypes
  selectedRelationType: string[] = []; // Array to store selected DayTypes
  id: string = '';
  constructor(
    private _dayService: DayService,
    // public tableUtils: TableUtils,
    public localStorageService: LocalStorageService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    public datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.globalService.getCommonListItems(DBConstants.MONTH).subscribe({
      next: (res: any) => {
        this.monthList = res;
        // this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });

    // this.loaderService.showLoader();
    this.globalService.getCommonListItems(DBConstants.DAYTYPE).subscribe({
      next: (res: any) => {
        this.dayTypeList = res;
        // this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
    this.globalService.getCommonListItems(DBConstants.RELATION).subscribe({
      next: (res: any) => {
        this.relationTypeList = res;
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });

    this.columnConfiguration();
    this.loadGrid();
    this.globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.DAY) {
        this.loadGrid();
      }
    });
    this.globalService.refreshList$.subscribe((listName: string) => {
      if (listName === ApplicationModules.DAY) {
        this.applyFilters();
      }
    });
  }

  loadGrid() {
    this.loaderService.showLoader();
    this._dayService
      .getDayList(
        this.lableForMonthDropDownIds,
        this.lableForDayTypeDropDownIds,
        this.lableForRelationTypeDropDownIds,
        this.searchText,
        this.isToday,
        this.isTomorrow,
        this.isYesterday
      )
      .subscribe({
        next: (res: any) => {
          this.tableData = res;
          this.filteredTableData = res;
          console.log("res : ", res);

          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log("error : ", error);
          this.loaderService.hideLoader();
        },
      });
  }

  columnConfiguration() {
    this.tableColumnConfig = [
      {
        title: "Date",
        field: "specialOccasionDate",
        sorter: "alphanum",
        maxWidth: 100,
        formatter: this.dateFormatter.bind(this),
      },
      {
        title: "Person Name",
        titleFormatter(_cell, _formatterParams, onRendered) {
          onRendered(() => { });
          return `
            <div class="client-name-header">
              Person Name
            </div>
          `;
        },

        field: "personName",
        sorter: "string",
      },

      {
        title: "Relation",
        field: "relationShipName"
      },
      {
        title: "Email Id",
        field: "emailId",
        sorter: "alphanum",
      },
      {
        title: "Mobile Number",
        field: "mobileNumber",
        sorter: "alphanum",
      },
      {
        title: "Address",
        field: "address",
        sorter: "alphanum",
      },
      {
        title: "Day Type",
        field: "dayType",
        sorter: "alphanum",
      },
      {
        title: "Pic",
        field: "thumbnailPath",
        formatter: this.picFormatter.bind(this),
      },
      {
        title: "-",
        field: "-",
        maxWidth: 50,
        formatter: this.globalService.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const birthdayId = cell.getRow().getData()["id"];
          this.hideDay(birthdayId);
        },
      },
      {
        title: "",
        field: "options",
        maxWidth: 50,
        formatter: (_cell) =>
          '<button class="action-buttons" title="More Actions" style="padding-right:100px;"><i class="bi bi-three-dots btn-link"></i></button>',
        clickMenu: this.generateOptionsMenu(this),
        hozAlign: "left",
        headerSort: false,
      },
    ];

  }

  picFormatter(cell: CellComponent) {
    const rowData = cell.getRow().getData();
    let thumbnailPath = rowData["thumbnailPath"];
    if (thumbnailPath) {
      thumbnailPath = API_URL.ATTACHMENT + thumbnailPath;

      // const html = `<i class="bi bi-person-circle fs-3" style="color: blue;"></i>`;
      const html = `<img src="${thumbnailPath}" style="width: 40px; height: 40px; object-fit: cover;" />`;
      console.log('html : ', html);

      return html;
    }
    const imagePath = rowData["imagePath"];
    if (imagePath) {
      const html = `<i class="bi bi-person-circle fs-3" style="color: blue;"></i>`;
      return html;
    }
    const html = "";
    return html;
  }

  dateFormatter(cell: CellComponent) {
    const columnName = cell.getColumn().getField();
    const occasionData = cell.getRow().getData();
    const dateColumn = occasionData[columnName];
    if (dateColumn) {
      return `<span>${this.datePipe.transform(dateColumn, "dd-MMM")}</span>`;
    }
    const nullDate = "";
    return `<span>${nullDate}</span>`;
  }

  
  generateOptionsMenu(rowData: Record<string, any>) {
    const menu = [];
    // if (
    //   rowData['id'] &&
    //   this.globalService.isAccessible(ApplicationModules.DAY, ApplicationModuleActions.EDIT)
    // )
    {
      menu.push({
        label: `<a class="dropdown-item btn-link options-menu-item"
            data-bs-toggle="modal" data-bs-target="#userDetailsPopup">
                <i class="bi bi-pencil"></i>
                  &nbsp;Edit
                </a>
                `,
        action: () => this.openDetailsPopup(rowData['id']),
      });

      menu.push({
        label: `<a class="dropdown-item btn-link"
              data-bs-toggle="modal" data-bs-target="#confirmationPopup">
                  <i class="bi bi-trash"></i>
                    &nbsp;Delete
                  </a>
                  `,
        action: (_e: any, cell: CellComponent) => {
          const expenseData = cell.getRow().getData();
          const expenseId = expenseData["id"];
          this.deleteDay(expenseId);
        },
      });
    }
    return menu;
  }

  deleteDay(birthdayId: string) {
    if (birthdayId) {
      this.id = birthdayId;
      this.confirmationDialog.openConfirmationPopup(
        "Confirmation",
        "Are you sure you want to delete this record? This action cannot be undone."
      );
    }
  }

  handleConfirmResult(isConfirmed: boolean) {
    console.log(isConfirmed);
    debugger
    if (isConfirmed) {
      this.loaderService.showLoader();
      this._dayService.deleteDay(this.id).subscribe({
        next: (res: any) => {
          this.toaster.showMessage("Record deleted successfully.", "success");
          this.removeDay(this.id);
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log("error : ", error);
          this.toaster.showMessage("Failed to delete the record.", "error");
          this.loaderService.hideLoader();
        },
      });
    }
  }

  // Handle "Select All" checkbox
  toggleAllMonthCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedMonths = this.monthList.map((m: any) => m.listItemName);
      this.selectedMonthsIds = this.monthList.map((m: any) => m.sequenceNumber);
    } else {
      this.selectedMonths = [];
      this.selectedMonthsIds = [];
    }
    this.getMonthDropdownLabel();
    this.applyFilters();
  }
  // Handle individual month selection
  toggleMonthCheck(event: Event, monthName: string, seqNum: number) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedMonths.push(monthName);
      this.selectedMonthsIds.push(seqNum);
    } else {
      this.selectedMonths = this.selectedMonths.filter((m) => m !== monthName);
      this.selectedMonthsIds = this.selectedMonthsIds.filter((m) => m !== seqNum);
    }
    // if (checked) {
    //   this.selectedMonths.push(monthName);
    //   this.selectedMonthsIds.push(seqNum);
    // } else {
    //   this.selectedMonths = this.selectedMonths.filter((m) => m !== monthName);
    //   this.selectedMonthsIds = this.selectedMonthsIds.filter((m) => m !== seqNum);
    // }
    this.getMonthDropdownLabel();
    this.applyFilters();
  }
  getMonthDropdownLabel() {
    if (this.selectedMonths.length === 0) {
      this.lableForMonthDropDown = "";
    } else if (this.selectedMonths.length === this.monthList.length) {
      this.lableForMonthDropDown = "All";
      this.lableForMonthDropDownIds = "";
    } else {
      this.lableForMonthDropDown = this.selectedMonths.join(", ");
      this.lableForMonthDropDownIds = this.selectedMonthsIds.join(", ");
    }
  }
  // Handle "Select All" checkbox
  toggleAllDayTypeCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedDayType = checked
      ? this.dayTypeList.map((m: any) => m.listItemDescription)
      : [];

    this.getDayTypeDropdownLabel();
    this.applyFilters();
  }
  // Handle individual daytype selection
  toggleDayTypeCheck(event: Event, daytypeName: string, dayId: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedDayType.push(daytypeName);
    } else {
      this.selectedDayType = this.selectedDayType.filter((m) => m !== daytypeName);
    }
    this.getDayTypeDropdownLabel();
    this.applyFilters();
  }

  getDayTypeDropdownLabel() {
    if (this.selectedDayType.length === 0) {
      this.lableForDayTypeDropDown = "";
    } else if (this.selectedDayType.length === this.dayTypeList.length) {
      this.lableForDayTypeDropDown = "All";
      this.lableForDayTypeDropDownIds = '';
    } else {
      this.lableForDayTypeDropDown = this.selectedDayType.join(", ");
    }
  }

  // Handle "Select All" checkbox
  toggleAllRelationTypeCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedRelationType = checked
      ? this.relationTypeList.map((m: any) => m.listItemDescription)
      : [];

    this.getRelationTypeDropdownLabel();
    this.applyFilters();
  }
  // Handle individual relationtype selection
  toggleRelationTypeCheck(event: Event, relationtypeName: string, relationId: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedRelationType.push(relationtypeName);
    } else {
      this.selectedRelationType = this.selectedRelationType.filter((m) => m !== relationtypeName);
    }
    this.getRelationTypeDropdownLabel();
    this.applyFilters();
  }

  getRelationTypeDropdownLabel() {
    if (this.selectedRelationType.length === 0) {
      this.lableForRelationTypeDropDown = "";
    } else if (this.selectedRelationType.length === this.relationTypeList.length) {
      this.lableForRelationTypeDropDown = "All";
      this.lableForRelationTypeDropDownIds = "";
    } else {
      this.lableForRelationTypeDropDown = this.selectedRelationType.join(", ");
    }
  }

  openDetailsPopup(dayId: any) {
    console.log("dayDetails clicked");
    this.dayDetailsComponent.openDetailsPopup(dayId);
  }

  hideDay(dayId: string) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      const includeDay = item.id != dayId;
      return includeDay;
    });
  }
  removeDay(dayId: string) {
    this.tableData = this.tableData.filter((item: any) => {
      const includeDay = item.id != dayId;
      return includeDay;
    });
  }

  approveDay() { }

  filterGridSearchText(event: any) {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);

    this.searchText = event.target.value.toLowerCase();
    this.applyFilters();
  }

  task: Task = {
    name: "Show all records",
    completed: false,
    subtasks: [
      { name: "Today", completed: false },
      { name: "Yesterday", completed: false },
      { name: "Tomorrow", completed: false },
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
  //     this.typeInput.value = [];
  //   }

  //   this.loadGrid();

  // }

  someComplete(): boolean {
    this.isToday =
      this.task.subtasks != null && this.task.subtasks[0].completed; //(t => t.completed);
    this.isTomorrow =
      this.task.subtasks != null && this.task.subtasks[1].completed; //(t => t.completed);
    this.isYesterday =
      this.task.subtasks != null && this.task.subtasks[2].completed; //(t => t.completed);

    if (this.task.subtasks == null) {
      return false;
    }
    return (
      this.task.subtasks.filter((t) => t.completed).length > 0 &&
      !this.allComplete
    );
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

  //   this.loadGrid();
  // }

  applyFilters() {
    console.log("this.tableData : ", this.tableData);
    this.filteredTableData = this.tableData.filter((item: any) => {
      const matchesName = item.personName
        ?.toLowerCase()
        .includes(this.searchText);
      const email = item.emailId?.toLowerCase().includes(this.searchText);
      const address = item.address?.toLowerCase().includes(this.searchText);
      const date = item.date?.toLowerCase().includes(this.searchText);
      const mobileNumber = item.mobileNumber
        ?.toLowerCase()
        .includes(this.searchText);

      const month = item.specialOccasionDate
        ? new Date(item.specialOccasionDate).getMonth() + 1
        : null;

      const matchesMonth =
        this.selectedMonths.length === 0 ||
        (month !== null && this.selectedMonthsIds.includes(month));

      // const matchesMonth =
      //   this.selectedMonths.length === 0 ||
      //   this.selectedMonths.includes(item.month);
      const matchesDayType =
        this.selectedDayType.length === 0 ||
        this.selectedDayType.includes(item.dayType);
      const matchesRelationType =
        this.selectedRelationType.length === 0 ||
        this.selectedRelationType.includes(item.relationShipName);
      return (
        (matchesName || email || address || date || mobileNumber) &&
        matchesMonth &&
        matchesDayType &&
        matchesRelationType
      );
    });
    console.log("this.filteredTableData : ", this.filteredTableData);
  }
}
