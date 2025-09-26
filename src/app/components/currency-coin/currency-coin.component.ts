import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { API_URL } from '../../../utils/api-url';
import { ActionConstant, ApplicationConstantHtml, ApplicationTableConstants, NavigationURLs } from '../../../utils/application-constants';
import { CurrencyCoinService } from '../../services/currency-coin/currency-coin.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { CurrencyCoinDetailsComponent } from '../currency-coin-details/currency-coin-details.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";

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
  public filteredCoinList: any[] = [];
  public columnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];
  public viewMode: 'grid' | 'gallery' = 'grid';

  constructor(
    private router: Router,
    private currencyCoinService: CurrencyCoinService,
    private localStorageService: LocalStorageService,
    public globalService: GlobalService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.showLoader();
    this.columnConfiguration();
    this.countryList = this.localStorageService.getCountryList();
    this.LoadGrid();
    this.globalService.reloadGrid$.subscribe(() => {
      
      
      
    });
    this.globalService.refreshList$.subscribe(() => {
      
      
      
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
        bottomCalcFormatter: this.amountColorFormatter.bind(this), 
        bottomCalcFormatterParams: { symbol: "", precision: 2 }, 
      },
      {
        title: "Indian Value",
        field: "indianValue",
        sorter: "alphanum",
        formatter: this.amountColorFormatter.bind(this),
        bottomCalc: "sum", 
        bottomCalcFormatter: this.amountColorFormatter.bind(this), 
        bottomCalcFormatterParams: { symbol: "", precision: 2 }, 
      },
      {
        title: "Other details",
        field: "description",
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
          const collectionCoinId = cell.getRow().getData()["id"];
          this.hideCollectionCoin(collectionCoinId); 
        },
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
        formatter: this.globalService.threeDotsFormatter.bind(this),
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
        this.filteredCoinList = res.data;
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
    const filtered = this.tableData.filter((item: any) => {
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
    this.filteredTableData = filtered;
    this.filteredCoinList = filtered as any[];
  }

  
  toggleAllCountryCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedCountry = checked
      ? this.countryList.map((m: any) => m.listItemDescription)
      : [];

    this.getCountryDropdownLabel();
    this.applyFilters();
  }
  
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

  setView(mode: 'grid' | 'gallery') {
    this.viewMode = mode;
  }

}


