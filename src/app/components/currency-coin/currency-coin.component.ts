import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CurrencyCoinService } from '../../services/currency-coin/currency-coin.service';
import { CurrencyCoinDetailsComponent } from '../currency-coin-details/currency-coin-details.component'
import { CommonModule } from '@angular/common';
import { API_URL } from '../../../utils/api-url';
import { ColumnDefinition, CellComponent } from 'tabulator-tables';
import { ActionConstant, ApplicationConstantHtml, ApplicationTableConstants, NavigationURLs } from '../../../utils/application-constants';
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
  ActionConstant = ActionConstant;
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
  public columnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];

  constructor(
    private router: Router,
    private currencyCoinService: CurrencyCoinService,
    public globalService: GlobalService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.showLoader();
    this.columnConfiguration();
    this.globalService.getCountryList().subscribe({
      next: (res: any) => {
        this.countryList = res.data;
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

  columnConfiguration() {
    this.columnConfig = [
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
        title: "",
        field: "",
        maxWidth: 70,
        formatter: this.globalService.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const collectionCoinId = cell.getRow().getData()["id"];
          this.hideCollectionCoin(collectionCoinId); // Call the hideCollectionCoin method
        },
        headerSort: false,
      },
    ];
    if (
      this.globalService.isAccessible(ActionConstant.EDIT)||
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
      } else {
        // Hide global dropdown
        const globalMenu = document.getElementById('globalDropdownMenu');
        if (globalMenu) globalMenu.remove();
      }
    });
  }
  generateOptionsMenu(rowData: Record<string, any>) {
    
    const menu = [];
    if (
      this.globalService.isAccessible(ActionConstant.EDIT)
    ) {
      menu.push({
        label: ApplicationConstantHtml.EDIT_LABLE,
        action: () => {
          this.currencyCoinDetails(rowData['id']);
        },
      });
    }
    if (
      this.globalService.isAccessible(ActionConstant.DELETE)
    ) {
      menu.push({
        label: ApplicationConstantHtml.DELETE_LABLE,
        action: () => {
          this.deleteCurrencyCoin(rowData['id']);
        },
      });
    }

    return menu;
  }

  hideCollectionCoin(collectionCoinId: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.id != collectionCoinId;
    });
  }

  LoadGrid() {
    this.currencyCoinService.getCurrencyCoinRecords().subscribe({
      next: (res: any) => {
        this.tableData = res.data;
        this.filteredTableData = res.data;
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
    const coinData = cell.getRow().getData();
    const columnValue = coinData[columnName];
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


