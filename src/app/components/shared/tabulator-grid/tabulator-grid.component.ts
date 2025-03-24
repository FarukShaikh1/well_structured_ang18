import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  CellComponent,
  ColumnDefinition,
  TabulatorFull,
} from "tabulator-tables";

/*
 * So - the whole point of TypeScript is to make things strictly typed.
 *
 * At the moment the input parameters (for column definitions and data) are not typed.
 *
 * Also - the events are not typed.
 *
 * So - if you want - then you can make types for things like tableData (then it will be a typed array).
 * The variables are well documented here: http://tabulator.info/docs/4.2/options
 *  (immediately after the overview at the top of the page)
 */
@Component({
  selector: "app-tabulator-grid",
  templateUrl: "./tabulator-grid.component.html",
  styleUrls: ["./tabulator-grid.component.css"],
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class TabulatorGridComponent implements OnChanges, OnDestroy {
  @ViewChild("tabulatorGridWrapper", { static: true })
  wrapperDiv!: ElementRef<HTMLDivElement>;

  @Input() tableData: Record<string, unknown>[] | undefined;
  @Input() columnConfig: ColumnDefinition[] | undefined;
  @Input() dateFormat = "";
  @Input() height = ""; // default is to auto-adjust height with the grid contents.
  @Input() paginationSize = 10; // Add default pagination size
  @Input() filterColumns!: ColumnDefinition[] | [];
  @Input() allowCSVExport!: boolean;
  @Input() noDataMessage = "No Data";
  @Input() noMatchingDataMessage = "No Matching Data";

  public filterForm!: FormGroup;

  // These are for passing grid events back to the parent component.
  @Output() buildingTable = new EventEmitter<void>();
  @Output() builtTable = new EventEmitter<void>();
  @Output() loadingData = new EventEmitter<Record<string, unknown>[]>();
  @Output() loadedData = new EventEmitter<Record<string, unknown>[]>();
  @Output() cellChanged = new EventEmitter<CellComponent>();

  // private variables for keeping track of the table.
  private tableDiv = document.createElement("div"); // this is the div that will contain that tabulator-grid HTML.
  private myTable?: TabulatorFull; // this will become a reference to the tabulator-grid object
  private gridClosing = false;
  isTableBuilt = false;

  constructor() {
    // Default the date format if it was not specified.
    this.dateFormat = this.dateFormat || "DD MMM YYYY";
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Configure the grid with whatever changes are made by the calling component.
    //  (this code also initialises the grid)
    if (changes["filterColumns"]) {
      this.createFilterForm(); // Initialize the filter form when filter columns change
    }
    this.drawTable(changes);
  }

  ngOnDestroy(): void {
    if (this.myTable) {
      this.myTable.clearData();
      this.myTable.destroy();
    }
  }

  // Create the filter form with dynamic columns and filter types
  private createFilterForm(): void {
    this.filterForm = new FormGroup({
      column: new FormControl(
        this.filterColumns[-1]?.field || "",
        Validators.required
      ),
      type: new FormControl("like", Validators.required),
      value: new FormControl(""),
    });

    this.filterForm.get("column")?.valueChanges.subscribe((_value) => {
      this.applyFilter();
    });
    this.filterForm.get("value")?.valueChanges.subscribe((_value) => {
      this.applyFilter();
    });
  }

  private isTableInitialized(): boolean {
    return !!this.myTable && !!this.myTable.element; // Check if the table and its element exist
  }

  applyFilter(): void {
    if (this.isTableInitialized()) {
      const column = this.filterForm.get("column")?.value;
      const type = this.filterForm.get("type")?.value;
      const value = this.filterForm.get("value")?.value;

      if (column && value) {
        this.myTable?.setFilter(column, type, value);
      } else {
        this.myTable?.clearFilter(true);
      }
    } else {
      console.warn("Table is not initialized. Filter cannot be applied.");
    }
  }

  // Clear the filter
  clearFilter(): void {
    this.filterForm.reset({ column: "", type: "like", value: "" });
    this.myTable?.clearFilter(true);
  }

  private drawTable(changes: SimpleChanges): void {
    if (this.gridClosing || !this.columnConfig) {
      return;
    }

    if (!this.myTable) {
      // Initialize Tabulator with local pagination
      this.myTable = new TabulatorFull(this.tableDiv, {
        // headerSortElement:'<i class=\'fas fa-arrow-up\'></i>',
        data: this.tableData || [],
        reactiveData: true,
        columns: this.columnConfig,
        layout: "fitColumns",
        responsiveLayout: "collapse",
        height: "530",
        maxHeight: "100%",

        pagination: true, // Enable pagination
        paginationMode: "local",
        paginationSize: this.paginationSize, // Items per page
        // paginationSizeSelector: [2, 5, 10, 20, 50, true],  // true is for 'All' option
        paginationSizeSelector: [2, 5, 10, 20, 50, 100, 500, true],
        paginationButtonCount: 4,

        // paginationCounter: 'rows',
        // paginationCounter: 'pages',
        paginationCounter: function (
          pageSize,
          currentRow,
          currentPage,
          totalRows,
          _totalPages
        ) {
          if (totalRows === 0) {
            return "No records available";
          }
          const startRow = currentRow; // Current row already reflects the starting position
          const endRow = Math.min(currentRow + pageSize - 1, totalRows); // Adjust end row correctly
          return `Showing ${startRow}-${endRow} out of ${totalRows} record(s)`;
        },

        movableColumns: true, // Move columns by mouse drag

        // Enable range selection and clipboard copy
        selectableRange: 1, // True
        selectableRangeColumns: false, // If its true, clicking on column name will select whole column.
        selectableRangeRows: false, // If its true, clicking on first column of the row will select whole row.
        selectableRangeClearCells: true,

        // selectableRows: 'highlight',
        // selectableRowsRollingSelection: true,

        clipboardCopyStyled: false,
        clipboardCopyConfig: {
          rowHeaders: false,
          columnHeaders: false,
        },

        selectableRangeMode: "click", // Enable cell range selection mode
        clipboard: true, // Enable clipboard
        clipboardCopyRowRange: "range",
        // clipboardPasteParser: 'range',
        // clipboardPasteAction: 'range',

        // rowHeader: { resizable: false, frozen: true, width: 10, hozAlign: 'center', headerSort: false },
        // rowHeader: { formatter: 'rownum' }, // To show serial number

        //setup cells to work as a spreadsheet
        columnDefaults: {
          headerHozAlign: "left",
          vertAlign: "middle",
          resizable: "header",
        },
        // rowHeight: 48,
        resizableRows: false,

        placeholder: () => {
          if (!this.isTableInitialized() || !this.isTableBuilt) {
            return this.noDataMessage; // Default until table is ready
          }
          const filtersExist = this.myTable!.getFilters(true).length > 0;
          return filtersExist ? this.noMatchingDataMessage : this.noDataMessage;
        },
      });

      this.myTable.on("tableBuilt", () => {
        this.isTableBuilt = true;
        this.tableBuilt(); // Emit the tableBuilt event to notify parent components
        this.updatePaginationVisibility(); // Update pagination visibility once the table is built
      });

      this.wrapperDiv.nativeElement.appendChild(this.tableDiv);
      this.updatePaginationVisibility();
    } else {
      if (changes["columnConfig"]) {
        this.myTable.setColumns(this.columnConfig);
      }
      if (changes["tableData"]) {
        this.myTable.setData(this.tableData).then(() => {
          this.updatePaginationVisibility(); // Adjust pagination after data is updated
        });
      }
    }
  }

  private updatePaginationVisibility(): void {
    const paginationElement = this.wrapperDiv.nativeElement.querySelector(
      ".tabulator-paginator"
    ) as HTMLElement;
    if (paginationElement) {
      if (this.tableData && this.tableData.length > 0) {
        paginationElement.style.display = "block";
      } else {
        paginationElement.style.display = "none";
      }
    }
  }

  exportTableData() {
    this.myTable?.download("csv", "table-data.csv");
  }

  /**
   * Filter rows based on a search query.
   * @param searchText - The search text to filter the table data.
   */
  public applySearch(searchText: string): void {
    this.myTable?.setFilter((row) => {
      // Check if the row has getData method, otherwise use the row object itself
      const rowData = row.getData ? row.getData() : row;

      // Extract only the actual data values (not getters/setters)
      const actualValues = Object.entries(rowData)
        .filter(([_key, value]) => typeof value !== "function") // Ignore functions (getters/setters)
        .map(([_key, value]) => value);

      // Check if any of the values contain the search text
      return actualValues.some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }

  clearEmptyCellSelection() {
    const activeCells = document.querySelectorAll(
      ".tabulator-range-cell-active"
    );
    activeCells.forEach((cell) =>
      cell.classList.remove("tabulator-range-cell-active")
    );
  }

  //////////////////////////////////////////////////////////////////
  // Passing grid events to the component that has the grid: Begin
  private tableBuilding() {
    this.buildingTable.emit();
  }
  private tableBuilt() {
    this.builtTable.emit();
  }
  private cellEdited(cell: CellComponent) {
    //cell - cell
    this.cellChanged.emit(cell);
  }
  private dataLoading(data: Record<string, unknown>[]) {
    //data - the data loading into the table
    this.loadingData.emit(data);
  }
  private dataLoaded(data: Record<string, unknown>[]) {
    //data - the data loading into the table
    this.loadedData.emit(data);
  }

  // Passing grid events to the component that has the grid: End
  //////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////
  // Date Handling: Begin
  // private dateSorter(a: string, b: string,
  //   aRow: RowComponent, bRow: RowComponent, column: ColumnComponent,
  //   dir: string, sorterParams: Record<string, undefined>) {
  //   a, b - the two values being compared
  //   aRow, bRow - the row components for the values being compared (useful if you need to access additional fields in the row data for the sort)
  //   column - the column component for the column being sorted
  //   dir - the direction of the sort ("asc" or "desc")
  //   sorterParams - sorterParams object from column definition array
  //   const date1 = Utilities.newDate(a, this.dateFormat);
  //   const date2 = Utilities.newDate(b, this.dateFormat);
  //   return date1.diff(date2, 'seconds'); // return the difference between the two dates
  // }

  // Date Handling: End
  //////////////////////////////////////////////////////////////////

  // Generic logic - this could be moved to a common library if you want.
  // foreach using the fastest iterator in Javascript (the while loop)
  // private fastForEach<T>(inArr: T[], execFunc: (element: T, i: number) => void): void {
  //   let i = 0;
  //   while (i < inArr.length) {
  //     execFunc(inArr[i], i);
  //     i++;
  //   }
  // }

  get columnControl(): FormControl {
    return this.filterForm.get("column") as FormControl;
  }

  get typeControl(): FormControl {
    return this.filterForm.get("type") as FormControl;
  }

  get valueControl(): FormControl {
    return this.filterForm.get("value") as FormControl;
  }
}
