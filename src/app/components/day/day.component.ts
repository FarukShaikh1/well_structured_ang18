import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CellComponent, ColumnDefinition } from "tabulator-tables";
import { API_URL } from "../../../utils/api-url";
import {
  ActionConstant,
  ApplicationConstantHtml,
  ApplicationModules,
  ApplicationTableConstants,
  LocalStorageConstants,
  UserConfig
} from "../../../utils/application-constants";
import { ConfigurationService } from "../../services/configuration/configuration.service";
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
  public columnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];
  ActionConstant = ActionConstant;
  monthList: any;
  occasionTypeList: any = "";
  relationList: any = "";
  isToday: boolean = false;
  isTomorrow: boolean = false;
  isYesterday: boolean = false;
  daySelected: number[] = [];
  searchText: string = "";
  lableForMonthDropDown = "";
  lableForMonthDropDownIds = "";
  selectedMonths: string[] = []; // Array to store selected months
  selectedMonthsIds: number[] = []; // Array to store selected months
  lableForOccasionTypeDropDown = "";
  lableForOccasionTypeDropDownIds = "";
  lableForRelationTypeDropDown = "";
  lableForRelationTypeDropDownIds = "";
  selectedOccasionType: string[] = []; // Array to store selected OccasionTypes
  selectedRelationType: string[] = []; // Array to store selected OccasionTypes
  id: string = '';
  loggedInUserId: string = '';
  constructor(
    private _dayService: DayService,
    // public tableUtils: TableUtils,
    public localStorageService: LocalStorageService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    public configService: ConfigurationService,
    public datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.loggedInUserId = localStorage.getItem(LocalStorageConstants.USERID) || '';
    this.monthList = this.localStorageService.getCommonListItems(LocalStorageConstants.MONTH_LIST);

    // this.loaderService.showLoader();
    this.configService.getConfigList(this.loggedInUserId, UserConfig.OCCASION_TYPE).subscribe({
      next: (res: any) => {
        this.occasionTypeList = res.data;
        // this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
    this.configService.getConfigList(this.loggedInUserId, UserConfig.RELATION).subscribe({
      next: (res: any) => {
        this.relationList = res.data;
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
        this.lableForOccasionTypeDropDownIds,
        this.lableForRelationTypeDropDownIds,
        this.searchText,
        this.isToday,
        this.isTomorrow,
        this.isYesterday
      )
      .subscribe({
        next: (res: any) => {
          this.tableData = res.data;
          this.filteredTableData = res.data;
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
    this.columnConfig = [
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
        formatter: this.globalService.thumbnailFormatter.bind(this),
      },
      {
        title: "",
        field: "",
        maxWidth: 70,
        formatter: this.globalService.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const birthdayId = cell.getRow().getData()["id"];
          this.hideDay(birthdayId);
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

  ngAfterViewInit() {
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

  generateOptionsMenu(rowData: Record<string, any>) {
    const menu = [];
    if (this.globalService.isAccessible(ActionConstant.EDIT)) {
      menu.push({
        label: ApplicationConstantHtml.EDIT_LABLE,
        action: () => {
          this.openDetailsPopup(rowData['id']);
        },
      });
    }
    if (this.globalService.isAccessible(ActionConstant.DELETE)) {
      menu.push({
        label: ApplicationConstantHtml.DELETE_LABLE,
        action: () => {
          this.deleteDay(rowData['id']);
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
  toggleAllOccasionTypeCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedOccasionType = checked
      ? this.occasionTypeList.map((m: any) => m.listItemDescription)
      : [];

    this.getOccasionTypeDropdownLabel();
    this.applyFilters();
  }
  // Handle individual daytype selection
  toggleOccasionTypeCheck(event: Event, daytypeName: string, dayId: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedOccasionType.push(daytypeName);
    } else {
      this.selectedOccasionType = this.selectedOccasionType.filter((m) => m !== daytypeName);
    }
    this.getOccasionTypeDropdownLabel();
    this.applyFilters();
  }

  getOccasionTypeDropdownLabel() {
    if (this.selectedOccasionType.length === 0) {
      this.lableForOccasionTypeDropDown = "";
    } else if (this.selectedOccasionType.length === this.occasionTypeList.length) {
      this.lableForOccasionTypeDropDown = "All";
      this.lableForOccasionTypeDropDownIds = '';
    } else {
      this.lableForOccasionTypeDropDown = this.selectedOccasionType.join(", ");
    }
  }

  // Handle "Select All" checkbox
  toggleAllRelationCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedRelationType = checked
      ? this.relationList.map((m: any) => m.listItemDescription)
      : [];

    this.getRelationTypeDropdownLabel();
    this.applyFilters();
  }
  // Handle individual relationtype selection
  toggleRelationCheck(event: Event, relationtypeName: string, relationId: string) {
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
    } else if (this.selectedRelationType.length === this.relationList.length) {
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
    this.filteredTableData = this.tableData;
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
      const matchesOccasionType =
        this.selectedOccasionType.length === 0 ||
        this.selectedOccasionType.includes(item.dayType);
      const matchesRelationType =
        this.selectedRelationType.length === 0 ||
        this.selectedRelationType.includes(item.relationShipName);
      return (
        (matchesName || email || address || date || mobileNumber) &&
        matchesMonth &&
        matchesOccasionType &&
        matchesRelationType
      );
    });
    console.log("this.filteredTableData : ", this.filteredTableData);
  }
}
