import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CurrencyCoinService } from '../../services/currency-coin/currency-coin.service';
import { CurrencyCoinDetailsComponent } from '../currency-coin-details/currency-coin-details.component'
import { CommonModule } from '@angular/common';
import { API_URL } from '../../../utils/api-url';
import { ColumnDefinition, CellComponent } from 'tabulator-tables';
import { ApplicationTableConstants } from '../../../utils/application-constants';
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-currency-coin',
  standalone: true,
  templateUrl: './currency-coin.component.html',
  imports: [CommonModule, TabulatorGridComponent, CurrencyCoinDetailsComponent],
  styleUrls: ['./currency-coin.component.scss']
})

export class CurrencyCoinComponent implements OnInit {
  @ViewChild("searchInput") searchInput!: ElementRef;
  basePath: string = API_URL.ATTACHMENT;
  searchText: string = '';
  public tableData: Record<string, unknown>[] = [];
  public filteredTableData: Record<string, unknown>[] = [];
  public tableColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE; // Set default pagination size
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];

  optionsMenu = [
    {
      label: `<a class="dropdown-item btn-link"
              data-bs-toggle="modal" data-bs-target="#collectioncoinDetailsPopup">
                  <i class="bi bi-pencil"></i>
                    &nbsp;Edit
                  </a>
                  `,
      action: (_e: any, cell: CellComponent) => {
        const collectioncoinData = cell.getRow().getData();
        const collectioncoinId = collectioncoinData["collectioncoinId"];
        this.currencyCoinDetails(collectioncoinId);
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
        const collectioncoinData = cell.getRow().getData();
        const collectioncoinId = collectioncoinData["collectioncoinId"];
        this.currencyCoinDetails(collectioncoinId);
      },
    },
  ];

  constructor(
    private currencyCoinService: CurrencyCoinService,
    public globalService: GlobalService,
    private loaderService: LoaderService) { 
  debugger;
    }

  ngOnInit() {
    debugger
    this.loaderService.showLoader();
    this.collectioncoinColumnConfiguration();
    this.LoadGrid();
    this.globalService.reloadGrid$.subscribe(() => {
      // if (listName === ApplicationModules.COLLECTIONCOIN) {
      //   this.LoadGrid();
      // }
    });
    this.globalService.refreshList$.subscribe(() => {
      // if (listName === ApplicationModules.COLLECTIONCOIN) {
      //   this.applyFilters();
      // }
    });

  }

  // constructor( private _currencyCoinService: CurrencyCoinService) {

  // }


  // ngOnInit() {
  //   debugger;
  //   this.basePath = API_URL.ATTACHMENT;
  //   this.getCurrencyCoinRecords();

  // }
  collectioncoinColumnConfiguration() {
    this.tableColumnConfig = [
      {
        title: "collectionCoinId",
        field: "collectionCoinId",
        sorter: "alphanum",
      },
      {
        title: "collectionCoinName",
        field: "collectionCoinName",
        sorter: "alphanum",
      },
      {
        title: "countryName",
        field: "countryName",
        sorter: "alphanum",
        width: 400,
      },
      {
        title: "actualValue",
        field: "actualValue",
        sorter: "alphanum",
      },
      {
        title: "indianValue",
        field: "indianValue",
        sorter: "alphanum",
        formatter: this.amountColorFormatter.bind(this),
        bottomCalc: "sum", // This will calculate the sum
        bottomCalcFormatter: this.amountColorFormatter.bind(this), // Optional: Format the sum (if it's a currency value)
        bottomCalcFormatterParams: { symbol: "", precision: 2 }, // Customize formatting
      },
      {
        title: "description",
        field: "description",
        sorter: "alphanum",
        formatter: this.amountColorFormatter.bind(this),
        bottomCalc: "sum", // This will calculate the sum
        bottomCalcFormatter: this.amountColorFormatter.bind(this), // Optional: Format the sum (if it's a currency value)
        bottomCalcFormatterParams: { symbol: "", precision: 2 }, // Customize formatting
      },
      {
        title: "-",
        field: "-",
        maxWidth: 50,
        formatter: this.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const collectioncoinId = cell.getRow().getData()["collectioncoinId"];
          this.hideCollectionCoin(collectioncoinId); // Call the hideCollectionCoin method
        },
      },
      {
        title: "",
        field: "",
        maxWidth: 50,
        formatter: (_cell) =>
          '<button class="action-buttons" title="More Actions" style="padding-right:100px;"><i class="bi bi-three-dots btn-link"></i></button>',
        clickMenu: this.optionsMenu,
        hozAlign: "left",
        headerSort: false,
      },
    ];
  }

  hidebuttonFormatter(cell: CellComponent) {
    return `<button class="action-buttons" title="Hide CollectionCoin" style="padding-right:100px;"><i class="bi bi-dash-lg btn-link"></i></button>`;
  }

  hideCollectionCoin(collectioncoinId: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.collectioncoinId != collectioncoinId;
    });
  }

  LoadGrid() {
    debugger
    this.currencyCoinService.getCurrencyCoinRecords().subscribe((res: any) => {
      this.tableData = res;
      this.filteredTableData = res;
      this.collectioncoinColumnConfiguration();


    },
    )
  }

  amountColorFormatter(cell: CellComponent) {
    const columnName = cell.getColumn().getField();
    const projectData = cell.getRow().getData();
    const columnValue = projectData[columnName];
    const formattedValue = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(columnValue);
    if (columnValue > 0) {
      return `<span style="color:#129D0A; font-weight:bold">${formattedValue}</span>`;
    }
    if (columnValue < 0) {
      return `<span style="color:#FF0000; font-weight:bold">${formattedValue}</span>`;
    }
    return `<span></span>`;
  }

  filterGridBySearch(data: any) {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
    this.searchText = data?.target?.value?.toLowerCase();
    this.applyFilters();
  }

  currencyCoinDetails(data: any) {
  }

  applyFilters() {
    this.filteredTableData = this.tableData.filter((item: any) => {
      const matchesName = item.PersonName.toLowerCase().includes(this.searchText);
      return matchesName;
    });
  }


}


