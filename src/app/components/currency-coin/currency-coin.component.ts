import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CurrencyCoinService } from '../../services/currency-coin/currency-coin.service';
import { CurrencyCoinDetailsComponent } from '../currency-coin-details/currency-coin-details.component'
import { CommonModule } from '@angular/common';
import { API_URL } from '../../../utils/api-url';
import { ColumnDefinition, CellComponent } from 'tabulator-tables';
import { ApplicationTableConstants, NavigationURLs } from '../../../utils/application-constants';
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-currency-coin',
  standalone: true,
  templateUrl: './currency-coin.component.html',
  imports: [CommonModule, TabulatorGridComponent, ConfirmationDialogComponent, CurrencyCoinDetailsComponent],
  styleUrls: ['./currency-coin.component.scss']
})

export class CurrencyCoinComponent implements OnInit {
  selectedCountry: string[] = [];
  selectedCountryCode: string[] = [];
  countryList: any;
  lableForCountryDropDown: string = '';

  @ViewChild(CurrencyCoinDetailsComponent)
  currencyCoinDetailsComponent!: CurrencyCoinDetailsComponent;
  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;

  @ViewChild("searchInput") searchInput!: ElementRef;
  basePath: string = API_URL.ATTACHMENT;
  searchText: string = '';
  currencyCoinId: string = '';
  public tableData: Record<string, unknown>[] = [];
  public filteredTableData: Record<string, unknown>[] = [];
  public tableColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];

  optionsMenu = [
    {
      label: `<a class="dropdown-item btn-link"
              data-bs-toggle="modal" data-bs-target="#currencyCoinDetailsPopup">
                  <i class="bi bi-pencil"></i>
                    &nbsp;Edit
                  </a>
                  `,
      action: (_e: any, cell: CellComponent) => {
        const collectionCoinData = cell.getRow().getData();
        const collectionCoinId = collectionCoinData["id"];
        this.currencyCoinDetails(collectionCoinId);
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
        const collectionCoinData = cell.getRow().getData();
        const collectionCoinId = collectionCoinData["id"];
        this.deleteCurrencyCoin(collectionCoinId);
      },
    },
  ];

  constructor(
    private router: Router,
    private currencyCoinService: CurrencyCoinService,
    public globalService: GlobalService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.showLoader();
    this.collectionCoinColumnConfiguration();
    this.globalService.getCountryList().subscribe({
      next: (res: any) => {
        this.countryList = res;
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });

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

  collectionCoinColumnConfiguration() {
    this.tableColumnConfig = [
      {
        title: "Coin/Note Name",
        field: "coinNoteName",
        sorter: "alphanum",
      },
      {
        title: "Country",
        field: "countryName",
        sorter: "alphanum",
      },
      {
        title: "Real Value",
        field: "actualValue",
        sorter: "alphanum",
        formatter: this.amountColorFormatter.bind(this),
        bottomCalcFormatter: this.amountColorFormatter.bind(this), // Optional: Format the sum (if it's a currency value)
        bottomCalcFormatterParams: { symbol: "", precision: 2 }, // Customize formatting
      },
      {
        title: "Indian Value",
        field: "indianValue",
        sorter: "alphanum",
        formatter: this.amountColorFormatter.bind(this),
        bottomCalc: "sum", // This will calculate the sum
        bottomCalcFormatter: this.amountColorFormatter.bind(this), // Optional: Format the sum (if it's a currency value)
        bottomCalcFormatterParams: { symbol: "", precision: 2 }, // Customize formatting
      },
      {
        title: "Other details",
        field: "description",
        sorter: "alphanum",
      },
      {
        title: "-",
        field: "-",
        maxWidth: 50,
        formatter: this.globalService.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const collectionCoinId = cell.getRow().getData()["id"];
          this.hideCollectionCoin(collectionCoinId); // Call the hideCollectionCoin method
        },
        headerSort: false,
      },
      {
        title: "",
        field: "",
        maxWidth: 50,
        formatter: (_cell) =>
          '<button class="action-buttons" title="More Actions" style="padding-right:0px;"><i class="bi bi-three-dots btn-link"></i></button>',
        clickMenu: this.optionsMenu,
        hozAlign: "left",
        headerSort: false,
      },
    ];
  }

  hideCollectionCoin(collectionCoinId: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.id != collectionCoinId;
    });
  }

  LoadGrid() {
    this.currencyCoinService.getCurrencyCoinRecords().subscribe({
      next: (res: any) => {
        this.tableData = res;
        this.filteredTableData = res;
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
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
      return `<span style="font-weight:bold">${formattedValue}</span>`;
    }
    if (columnValue < 0) {
      return `<span style="font-weight:bold">${formattedValue}</span>`;
    }
    return `<span></span>`;
  }


  filterGridSearchText(event: any) {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);

    this.searchText = event.target.value.toLowerCase();
    this.applyFilters();
  }

  currencyCoinDetails(data: any) {
    this.currencyCoinDetailsComponent.openDetailsPopup(data);
  }

  deleteCurrencyCoin(currencyCoinId: string) {
    if (currencyCoinId) {
      this.currencyCoinId = currencyCoinId;
      this.confirmationDialog.openConfirmationPopup(
        "Confirmation",
        "Are you sure you want to delete this currencyCoin? This action cannot be undone."
      );
    }
  }

  handleConfirmResult(isConfirmed: boolean) {
    console.log(isConfirmed);
    if (isConfirmed) {
      // this.loaderService.showLoader();
      this.currencyCoinService.deleteCurrencyCoin(this.currencyCoinId).subscribe({
        next: (res: any) => {
          this.LoadGrid();
        },
        error: (error: any) => {
          console.log("error : ", error);
          this.loaderService.hideLoader();
        },
      });
    }
  }

  applyFilters() {
    this.filteredTableData = this.tableData.filter((item: any) => {
      const matchesCoinName = item.coinNoteName?.toLowerCase().includes(this.searchText);
      const matchesCountryName = item.countryName?.toLowerCase().includes(this.searchText);
      const matchesActulaValue = item.actualValue?.toString()?.toLowerCase().includes(this.searchText);
      const matchesIndianValue = item.indianValue?.toString()?.toLowerCase().includes(this.searchText);
      const matchesDescription = item.description?.toLowerCase().includes(this.searchText);

      const matchesCountry =
        this.selectedCountry.length === 0 ||
        this.selectedCountry.includes(item.countryName);

      return (matchesCoinName || matchesCountryName || matchesActulaValue || matchesIndianValue || matchesDescription) && matchesCountry;
    });
  }

  // Handle "Select All" checkbox
  toggleAllCountryCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedCountry = checked
      ? this.countryList.map((m: any) => m.listItemDescription)
      : [];

    this.getCountryDropdownLabel();
    this.applyFilters();
  }
  // Handle individual daytype selection
  toggleCountryCheck(event: Event, countryName: string, code: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCountry.push(countryName);
      this.selectedCountryCode.push(code);
    } else {
      this.selectedCountry = this.selectedCountry.filter((m) => m !== countryName);
      this.selectedCountryCode = this.selectedCountryCode.filter((m) => m !== code);
    }
    this.getCountryDropdownLabel();
    this.applyFilters();
  }

  getCountryDropdownLabel() {
    if (this.selectedCountry.length === 0) {
      this.lableForCountryDropDown = "";
    } else if (this.selectedCountry.length === this.countryList.length) {
      this.lableForCountryDropDown = "All";
    } else {
      this.lableForCountryDropDown = this.selectedCountryCode.join(", ");
    }
  }

  currencyCoinGallery() {
    this.router.navigate([NavigationURLs.CURRENCY_GALLERY]);
  }

}


