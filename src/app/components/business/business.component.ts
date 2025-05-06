import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import flatpickr from "flatpickr";
import { CellComponent, ColumnDefinition } from "tabulator-tables";
import {
  ApplicationConstants,
  ApplicationModules,
  ApplicationTableConstants,
} from "../../../utils/application-constants";
import { DateUtils } from "../../../utils/date-utils";
import { BusinessService } from "../../services/business/business.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { BusinessDetailsComponent } from "../business-details/business-details.component";
import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { ToasterComponent } from "../shared/toaster/toaster.component";
export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: "app-business",
  standalone: true,
  imports: [
    CommonModule,
    TabulatorGridComponent,
    BusinessDetailsComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: "./business.component.html",
  providers: [DatePipe, DateUtils],
  styleUrls: ["./business.component.scss"],
})
export class BusinessComponent implements OnInit {
  @ViewChild("searchInput") searchInput!: ElementRef;
  @ViewChild("minInput") minInput!: any;
  @ViewChild("maxInput") maxInput!: any;
  @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild(BusinessDetailsComponent)
  businessDetailsComponent!: BusinessDetailsComponent;
  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;

  public tableData: Record<string, unknown>[] = [];
  public filteredTableData: Record<string, unknown>[] = [];
  public tableColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE; // Set default pagination size
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];

  lastBusinessDate: Date = new Date();

  fromDate = new Date();
  toDate = new Date();
  formattedFromDate: any;
  formattedToDate: any;
  sourceOrReason: string = "";
  minAmount: number = 0;
  maxAmount: number = 0;
  businessId: string = "";

  optionsMenu = [
    {
      label: `<a class="dropdown-item btn-link"
              data-bs-toggle="modal" data-bs-target="#businessDetailsPopup">
                  <i class="bi bi-pencil"></i>
                    &nbsp;Edit
                  </a>
                  `,
      action: (_e: any, cell: CellComponent) => {
        const businessData = cell.getRow().getData();
        const businessId = businessData["businessId"];
        this.businessDetails(businessId);
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
        const businessData = cell.getRow().getData();
        const businessId = businessData["businessId"];
        this.deleteBusiness(businessId);
      },
    },
  ];

  constructor(
    private businessService: BusinessService,
    public globalService: GlobalService,
    public datePipe: DatePipe,
    private loaderService: LoaderService,
    private dateUtil: DateUtils
  ) {}

  ngOnInit() {
    this.loaderService.showLoader();
    this.businessColumnConfiguration();
    this.fromDate.setDate(this.toDate.getDate() - 30);
    this.LoadGrid();
    this.globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.BUSINESS) {
        this.LoadGrid();
      }
    });
    this.globalService.refreshList$.subscribe((listName: string) => {
      if (listName === ApplicationModules.BUSINESS) {
        this.applyFilters();
      }
    });
  }
  businessColumnConfiguration() {
    this.tableColumnConfig = [
      {
        title: "Deal Date",
        field: "dealDate",
        sorter: "alphanum",
        formatter: this.dateFormatter.bind(this),
      },
      {
        title: "Client Name",
        field: "clientName",
        sorter: "alphanum",
      },
      {
        title: "Product",
        field: "productName",
        sorter: "alphanum",
      },
      {
        title: "Quantity",
        field: "quantity",
        sorter: "alphanum",
      },
      {
        title: "unit",
        field: "unit",
        sorter: "alphanum",
      },
      {
        title: "Delevered On",
        field: "deliveryDate",
        sorter: "alphanum",
        formatter: this.dateFormatter.bind(this),
      },
      {
        title: "Payment Status",
        field: "paymentStatus",
        sorter: "alphanum",
      },
      {
        title: "Deal Amount",
        field: "dealAmount",
        sorter: "alphanum",
      },
      // {
      //   title: "Pending Amount",
      //   field: "pendingAmount",
      //   sorter: "alphanum",
      // },
      {
        title: "Other Details",
        field: "description",
        sorter: "alphanum",
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

  dateFormatter(cell: CellComponent) {
    const columnName = cell.getColumn().getField();
    const businessData = cell.getRow().getData();
    const dateColumn = businessData[columnName];
    if (dateColumn) {
      return `<span>${this.datePipe.transform(
        dateColumn,
        ApplicationConstants.GLOBAL_DATE_FORMAT
      )}</span>`;
    }
    const nullDate = "";
    return `<span>${nullDate}</span>`;
  }

  productFormatter(cell: CellComponent) {
    const columnName = cell.getColumn().getField();
    const businessData = cell.getRow().getData();
    const quantityColumn = businessData["quantity"];
    const unitColumn = businessData["unit"];
    const productColumn = businessData["product"];
    if (productColumn) {
      return `<span>${
        quantityColumn + " " + unitColumn + " " + productColumn
      }</span>`;
    }
    return `<span>Uniknown</span>`;
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

    this.getBusinessList();
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


  applyFilters() {
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
    console.log("this.lastBusinessDate : ", this.lastBusinessDate);
  }

  getLatestBusinessDate(): any {
    if (!this.filteredTableData || this.filteredTableData.length === 0) {
      this.loaderService.hideLoader();
      return new Date(); // Return null if no data is available
    }
    this.loaderService.hideLoader();
    return this.filteredTableData[0]["dealDate"];
  }

  // hideBusiness(businessId: number) {
  //   this.onTableDataChange(1);
  //   this.filteredDataSource = this.filteredDataSource.filter((item: any) => {
  //     const includeBusiness = item.businessId != businessId;
  //     return includeBusiness;
  //   });
  //   this.filteredSummaryDataSource = this.filteredSummaryDataSource.filter((item: any) => {
  //     const includeBusiness = item.businessId != businessId;
  //     return includeBusiness;
  //   });
  // }

  onSourceOrReasonChange(valueToFilter: any) {
    this.sourceOrReason = valueToFilter.target.value.toLowerCase();
    this.applyFilters();
  }

  getBusinessList() {
    this.loaderService.showLoader();
    this.filterColumns = this.tableColumnConfig.filter((col) =>
      ["SourceOrReason", "emailId"].includes(col.field ?? "")
    );
    this.businessService
      .getBusinessList()
      .subscribe({
        next: (res: any) => {
          this.tableData = res;
          this.filteredTableData = res;
          this.lastBusinessDate = this.getLatestBusinessDate();
          console.log("this.lastBusinessDate : ", this.lastBusinessDate);
          console.log("this.filteredTableData : ", this.filteredTableData);
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log("error : ", error);
          this.loaderService.hideLoader();
        },
      });
  }

  businessDetails(businessId: any) {
    this.loaderService.showLoader();
    this.businessDetailsComponent.openDetailsPopup(businessId);
  }

  deleteBusiness(businessId: string) {
    if (businessId) {
      this.businessId = businessId;
      this.confirmationDialog.openConfirmationPopup(
        "Confirmation",
        "Are you sure you want to delete this business? This action cannot be undone."
      );
    }
  }

  handleConfirmResult(isConfirmed: boolean) {
    console.log(isConfirmed);
    this.businessService.deleteBusiness(this.businessId).subscribe({
      next: (res: any) => {
        this.LoadGrid();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
  }
  addBusiness(business: any) {
    this.businessService.addBusiness(business).subscribe({
      next: (res: any) => {
        this.LoadGrid();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
  }

  businessAdjustment() {}

  filterGridByFromDate(date: any) {
    console.log("fromDate : ", this.fromDate);

    this.fromDate = this.dateUtil.convertDDMMYYYYToDate(date); // this.datepipe.transform(data.value, 'MM-dd-yyyy');
    console.log("fromDate : ", this.fromDate);
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

  filterGridBySource(data: any) {
    if (data.source != null && data.source != undefined) {
      this.sourceOrReason = data.source.value.toLowerCase();
    } else if (data.value != null && data.value != undefined) {
      this.sourceOrReason = data.source.value.toLowerCase();
    }
    this.applyFilters();
  }

  filterGridBySearch(data: any) {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
    this.sourceOrReason = data?.target?.value?.toLowerCase();
    this.applyFilters();
  }

  getColorForAmount(amount: any): any {
    if (amount <= 0) {
      return { color: "#FF0000", "font-weight": "bold" };
    } else {
      return { color: "#129D0A", "font-weight": "bold" };
    }
  }

  getColorForText(col: any): any {
    if (col.toLowerCase().includes("emergency")) {
      return { color: "#FF0000", "font-weight": "bold" };
    } else if (col.toLowerCase().includes("return")) {
      return { color: "#129D0A", "font-weight": "bold" };
    } else if (col.toLowerCase().includes("recharge")) {
      return { color: "#F29D0A", "font-weight": "bold" };
    } else return {}; // Default style (no style)
  }
}
