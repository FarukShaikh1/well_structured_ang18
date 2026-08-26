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
import { CommonModule } from "@angular/common";
import { GridLoaderComponent } from "../grid-loader/grid-loader.component";


@Component({
  selector: "app-tabulator-grid",
  templateUrl: "./tabulator-grid.component.html",
  styleUrls: ["./tabulator-grid.component.css"],
  imports: [ReactiveFormsModule, CommonModule, GridLoaderComponent],
  standalone: true,
})

export class TabulatorGridComponent implements OnChanges, OnDestroy {
  @ViewChild("tabulatorGridWrapper", { static: true })
  wrapperDiv!: ElementRef<HTMLDivElement>;

  @Input() tableData: Record<string, unknown>[] | undefined;
  @Input() columnConfig: PrintColumnDefinition[] = [];
  @Input() dateFormat = "";
  @Input() height = "";
  @Input() paginationSize = 10;
  @Input() filterColumns!: ColumnDefinition[] | [];
  @Input() allowCSVExport!: boolean;
  @Input() allowPrint!: boolean;
  @Input() noDataMessage = "No Data";
  @Input() noMatchingDataMessage = "No Matching Data";
  @Input() isLoading: boolean = false;
  @Input() loadingText: string = "Loading data...";

  public filterForm!: FormGroup;


  @Output() buildingTable = new EventEmitter<void>();
  @Output() builtTable = new EventEmitter<void>();
  @Output() loadingData = new EventEmitter<Record<string, unknown>[]>();
  @Output() loadedData = new EventEmitter<Record<string, unknown>[]>();
  @Output() cellChanged = new EventEmitter<CellComponent>();


  private tableDiv = document.createElement("div");
  private myTable?: TabulatorFull;
  private gridClosing = false;
  isTableBuilt = false;

  constructor() {

    this.dateFormat = this.dateFormat || "DD MMM YYYY";
  }

  ngOnChanges(changes: SimpleChanges): void {


    if (changes["filterColumns"]) {
      this.createFilterForm();
    }
    this.drawTable(changes);
  }

  ngOnDestroy(): void {
    if (this.myTable) {
      this.myTable.clearData();
      this.myTable.destroy();
    }
  }


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
    return !!this.myTable && !!this.myTable.element;
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


  clearFilter(): void {
    this.filterForm.reset({ column: "", type: "like", value: "" });
    this.myTable?.clearFilter(true);
  }

  private drawTable(changes: SimpleChanges): void {
    if (this.gridClosing || !this.columnConfig) {
      return;
    }

    if (!this.myTable) {

      this.myTable = new TabulatorFull(this.tableDiv, {

        data: this.tableData || [],
        reactiveData: true,
        columns: this.columnConfig,
        layout: "fitColumns",
        // responsiveLayout: "collapse",
        height: "530",
        maxHeight: "100%",

        pagination: true,
        paginationMode: "local",
        paginationSize: this.paginationSize,

        paginationSizeSelector: [2, 5, 10, 20, 50, 100, 500, true],
        paginationButtonCount: 4,



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
          const startRow = currentRow;
          const endRow = Math.min(currentRow + pageSize - 1, totalRows);
          return `Showing ${startRow}-${endRow} out of ${totalRows} record(s)`;
        },

        movableColumns: true,


        // selectableRange: 1, 
        selectableRangeColumns: false,
        selectableRangeRows: false,
        selectableRangeClearCells: true,

        clipboardCopyStyled: false,
        clipboardCopyConfig: {
          rowHeaders: false,
          columnHeaders: false,
        },

        // selectableRangeMode: "click", 
        clipboard: true,
        clipboardCopyRowRange: "range",

        columnDefaults: {
          headerHozAlign: "left",
          vertAlign: "middle",
          resizable: "header",
        },

        resizableRows: false,

        placeholder: () => {
          if (!this.isTableInitialized() || !this.isTableBuilt) {
            return this.noDataMessage;
          }
          const filtersExist = this.myTable!.getFilters(true).length > 0;
          return filtersExist ? this.noMatchingDataMessage : this.noDataMessage;
        },
      });

      this.myTable.on("tableBuilt", () => {
        this.isTableBuilt = true;
        this.tableBuilt();
        this.updatePaginationVisibility();
      });

      this.wrapperDiv.nativeElement.appendChild(this.tableDiv);
      this.updatePaginationVisibility();
    } else {
      if (changes["columnConfig"]) {
        this.myTable.setColumns(this.columnConfig);
      }
      if (changes["tableData"]) {
        this.myTable.setData(this.tableData).then(() => {
          this.updatePaginationVisibility();
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

  private formatPrintValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  exportTableData() {
    this.myTable?.download("csv", "table-data.csv");
  }

  printGrid(): void {
    if (!this.tableData || this.tableData.length === 0) {
      return;
    }

    const printableColumns = this.columnConfig?.filter(
      (column: any) => column.print !== false
    ) ?? [];

    if (printableColumns.length === 0) {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1200,height=800');

    if (!printWindow) {
      return;
    }

    // ============================
    // Generate table headers
    // ============================

    const headers = printableColumns
      .map((column: any) => {
        const width = column.printWidth ?? 'auto';

        return `
        <th style="width: ${width};">
          ${column.title ?? ''}
        </th>
      `;
      })
      .join('');


    // ============================
    // Generate table rows
    // ============================

    const rows = this.tableData
      .map((row: any) => {

        const cells = printableColumns
          .map((column: any) => {

            const value = row[column.field];

            const width = column.printWidth ?? 'auto';

            return `
            <td style="width: ${width};">
              ${this.formatPrintValue(value)}
            </td>
          `;
          })
          .join('');

        return `<tr>${cells}</tr>`;
      })
      .join('');


    // ============================
    // Print document
    // ============================

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Report</title>
        <style>
          @page {
           size: A4 landscape;
            margin: 10mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10px;
            color: #000;
            background: #fff;
          }
          h2 {
            text-align: center;
            margin: 0 0 15px 0;
            font-size: 18px;
          }
          table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            /*
             * IMPORTANT
             * This makes printWidth work correctly.
             */
            table-layout: fixed;
          }
          th,
          td {
            border: 1px solid #000;
            padding: 6px 8px;
            font-size: 11px;
            text-align: left;
            vertical-align: middle;
            word-break: break-word;
            overflow-wrap: anywhere;
            overflow: hidden;
         }
          th {
            text-align: center;
            font-weight: bold;
            background: #f2f2f2;
          }
          tr {
            page-break-inside: avoid;
          }

          thead {
            display: table-header-group;
          }

          tbody {
            display: table-row-group;
          }
        </style>
      </head>
     <body>
        <h2>Report</h2>
        <table>
          <thead>
            <tr>
              ${headers}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  }
  public applySearch(searchText: string): void {
    this.myTable?.setFilter((row) => {

      const rowData = row.getData ? row.getData() : row;


      const actualValues = Object.entries(rowData)
        .filter(([_key, value]) => typeof value !== "function")
        .map(([_key, value]) => value);


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



  private tableBuilding() {
    this.buildingTable.emit();
  }
  private tableBuilt() {
    this.builtTable.emit();
  }
  private cellEdited(cell: CellComponent) {

    this.cellChanged.emit(cell);
  }
  private dataLoading(data: Record<string, unknown>[]) {

    this.loadingData.emit(data);
  }
  private dataLoaded(data: Record<string, unknown>[]) {

    this.loadedData.emit(data);
  }
































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

export interface PrintColumnDefinition extends ColumnDefinition {
  printWidth?: string;
}
