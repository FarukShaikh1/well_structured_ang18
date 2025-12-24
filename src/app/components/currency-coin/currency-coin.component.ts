import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { API_URL } from '../../../utils/api-url';
import { ActionConstant, ApplicationConstantHtml, ApplicationModules, ApplicationTableConstants, DdlConfig, NavigationURLs, UIStrings } from '../../../utils/application-constants';
import { TruncatePipe } from '../../common/truncate.pipe';
import { CacheService } from '../../services/cache/cache.service';
import { CurrencyCoinService } from '../../services/currency-coin/currency-coin.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { CurrencyCoinDetailsComponent } from '../currency-coin-details/currency-coin-details.component';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-currency-coin',
  standalone: true,
  templateUrl: './currency-coin.component.html',
  imports: [CommonModule, TabulatorGridComponent, ToasterComponent, ConfirmationDialogComponent, CurrencyCoinDetailsComponent, TruncatePipe, MyProfileComponent],
  styleUrls: ['./currency-coin.component.scss']
})

export class CurrencyCoinComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  selectedCountry: string[] = [];
  selectedType: string[] = [];
  countryList: any;
  typeList: any;
  filteredTypeList: any;
  lableForCountryDropDown: string = '';
  lableForTypeDropDown: string = '';
  ActionConstant = ActionConstant;
  @ViewChild(CurrencyCoinDetailsComponent)
  currencyCoinDetailsComponent!: CurrencyCoinDetailsComponent;
  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;

  @ViewChild("searchInput") searchInput!: ElementRef;
  basePath: string = API_URL.ATTACHMENT;
  searchText: string = '';
  currencyCoinId: string = '';
  fullscreenImage: string = "";

  public tableData: Record<string, unknown>[] = [];
  public filteredTableData: Record<string, unknown>[] = [];
  public filteredCoinList: any[] = [];
  public columnConfig: ColumnDefinition[] = [];
  public summaryTableData: Record<string, unknown>[] = [];
  public filteredSummaryTableData: Record<string, unknown>[] = [];
  public summaryTableColumnConfig: ColumnDefinition[] = [];
  public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
  public allowCSVExport = false;
  public filterColumns: ColumnDefinition[] = [];
  public viewMode: 'grid' | 'gallery' | 'summary' | 'news' = 'gallery';
  loading = false;
  currentIndex = 0;
  scale = 1;
  transformStyle = "scale(1)";
  slideInterval: any;
  touchStartX = 0;
  touchEndX = 0;
  constructor(
    private currencyCoinService: CurrencyCoinService,
    private localStorageService: LocalStorageService,
    public globalService: GlobalService,
    private cacheService: CacheService,
    private loaderService: LoaderService) {
  }

  async ngOnInit() {
    this.loaderService.showLoader(UIStrings.LOADERS.LOADING_CURRENCY_DATA);
    this.columnConfiguration();
    this.countryList = this.localStorageService.getCountryList();
    if (!this.countryList || this.countryList.length == 0) {
      this.globalService.setValuesInLocalStorage();
    }
    this.typeList = this.localStorageService.getCommonListItems(DdlConfig.COIN_TYPES);
    if (!this.typeList || this.typeList.length == 0) {
      this.globalService.setValuesInLocalStorage();
    }
    this.LoadSummaryGrid();
    this.globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.COIN_NOTE_COLLECTION) {
        this.loadGrid();
        this.applyFilters();
      }
    });
    this.globalService.refreshList$.subscribe(() => { });
    await this.loadGrid();
    // this.selectDefaultRareCoins();
  }
  removeBlur(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.remove('blur-load');
  }

  openFullscreenImage(imageUrl: string) {
    // Find index of clicked image
    this.currentIndex = this.filteredCoinList.findIndex(
      x => x.imagePathSasUrl === imageUrl
    );

    if (this.currentIndex === -1) this.currentIndex = 0;

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById("imageViewerModal")
    );
    this.resetZoom();
    modal.show();
    this.enableKeyboard();
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.filteredCoinList.length;
    this.resetZoom();
  }

  prevImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.filteredCoinList.length) %
      this.filteredCoinList.length;
    this.resetZoom();
  }

  jumpTo(index: number) {
    this.currentIndex = index;
    this.resetZoom();
  }

  /********* ZOOM *********/
  zoomIn() {
    this.scale += 0.1;
    this.transformStyle = `scale(${this.scale})`;
  }

  zoomOut() {
    if (this.scale > 0.2) this.scale -= 0.1;
    this.transformStyle = `scale(${this.scale})`;
  }

  resetZoom() {
    this.scale = 0.8;
    this.transformStyle = "scale(0.8)";
  }

  /********* MOBILE SWIPE *********/
  touchStart(event: any) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  touchMove(event: any) {
    this.touchEndX = event.changedTouches[0].screenX;
  }

  touchEnd() {
    if (this.touchEndX < this.touchStartX - 50) this.nextImage();
    if (this.touchEndX > this.touchStartX + 50) this.prevImage();
  }

  /********* KEYBOARD SUPPORT *********/
  enableKeyboard() {
    document.onkeydown = (e: any) => {
      if (e.key === "ArrowRight") this.nextImage();
      if (e.key === "ArrowLeft") this.prevImage();
      if (e.key === "Escape") document.getElementById("imageViewerModal")?.click();
    };
  }

  /********* OPTIONAL AUTO-SLIDE *********/
  startSlideshow() {
    this.slideInterval = setInterval(() => this.nextImage(), 3000);
  }

  stopSlideshow() {
    clearInterval(this.slideInterval);
  }
  selectDefaultRareCoins() {
    this.selectedType = [];
    this.selectedType.push('Indian Rare Coin');
    this.lableForTypeDropDown = 'Indian Rare Coin';
    this.applyFilters();
  }

  async reloadData() {
    localStorage.removeItem(NavigationURLs.CURRENCY_LIST);
    localStorage.removeItem(NavigationURLs.CURRENCY_SUMMARY);
    localStorage.removeItem(NavigationURLs.CURRENCY_GALLERY);
    this.LoadSummaryGrid();
    await this.loadGrid();
    this.applyFilters();
  }

  columnConfiguration() {
    this.columnConfig = [
      {
        title: UIStrings.COLUMN_TITLES.COIN_NOTE_NAME,
        field: "coinNoteName",
        sorter: "alphanum",
        minWidth: 200,
      },
      {
        title: UIStrings.COLUMN_TITLES.COUNTRY,
        field: "countryName",
        sorter: "alphanum",
        minWidth: 120,
      },
      {
        title: UIStrings.COLUMN_TITLES.REAL_VALUE,
        field: "actualValue",
        sorter: "alphanum",
        formatter: this.amountColorFormatter.bind(this),
        bottomCalcFormatter: this.amountColorFormatter.bind(this),
        bottomCalcFormatterParams: { symbol: "", precision: 2 },
        minWidth: 90,
      },
      {
        title: UIStrings.COLUMN_TITLES.INDIAN_VALUE,
        field: "indianValue",
        sorter: "alphanum",
        formatter: this.amountColorFormatter.bind(this),
        bottomCalc: "sum",
        bottomCalcFormatter: this.amountColorFormatter.bind(this),
        bottomCalcFormatterParams: { symbol: "", precision: 2 },
        minWidth: 90,
      },
      {
        title: UIStrings.COLUMN_TITLES.OTHER_DETAILS,
        field: "description",
        sorter: "alphanum",
        minWidth: 200,
      },
      {
        title: 'ExtractedText',
        field: "extractedText",
        sorter: "alphanum",
        minWidth: 200,
      },
      {
        title: "GeneratedDescription",
        field: "generatedDescription",
        sorter: "alphanum",
        minWidth: 200,
      },

      {
        title: UIStrings.COLUMN_TITLES.PIC,
        field: "thumbnailPath",
        formatter: this.globalService.blobThumbnailFormatter.bind(this),
        cellClick: (e, cell) => {
          const collectionCoinId = cell.getRow().getData()["id"];
          this.currencyCoinDetails(collectionCoinId);
        },
        minWidth: 70,
        maxWidth: 100,
      },
      {
        title: "",
        field: "",
        minWidth: 50,
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
        minWidth: 50,
        maxWidth: 70,
        formatter: this.globalService.threeDotsFormatter.bind(this),
        hozAlign: "center",
        headerSort: false,
      });
    }


    this.summaryTableColumnConfig = [
      {
        title: UIStrings.COLUMN_TITLES.COUNTRY,
        field: "countryName",
        sorter: "alphanum",
        minWidth: 150,
      },
      {
        title: UIStrings.COLUMN_TITLES.CURRENCY,
        field: "currencyName",
        sorter: "alphanum",
        formatter: (cell) => {
          const data = cell.getRow().getData();
          return `${data['currencyCode']} (${data['currencySymbol']}) - ${data['currencyName']}`;
        },
        minWidth: 180,
      },
      {
        title: UIStrings.COLUMN_TITLES.COINS,
        field: "numberOfCoins",
        sorter: "alphanum",
        headerHozAlign: "center",
        hozAlign: "center",
        bottomCalc: "sum",
        minWidth: 100,
      },
      {
        title: UIStrings.COLUMN_TITLES.NOTES,
        field: "numberOfNotes",
        sorter: "alphanum",
        headerHozAlign: "center",
        hozAlign: "center",
        bottomCalc: "sum",
        minWidth: 100,
      },
      {
        title: UIStrings.COLUMN_TITLES.TOTAL,
        field: "total",
        sorter: "alphanum",
        headerHozAlign: "center",
        hozAlign: "center",
        bottomCalc: "sum",
        minWidth: 120,
      },
      {
        title: "",
        field: "",
        minWidth: 50,
        maxWidth: 70,
        formatter: this.globalService.hidebuttonFormatter.bind(this),
        cellClick: (e, cell) => {
          const countryName = cell.getRow().getData()["countryName"];
          this.hideFromSummary(countryName);
        },
        headerSort: false,
      },
    ];
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
    if (
      this.globalService.isAccessible(ActionConstant.DELETE) && !rowData['isVerified']
    ) {
      menu.push({
        label: ApplicationConstantHtml.APPROVE_LABLE,
        action: () => {
          this.approveCurrencyCoin(rowData['id']);
        },
      });
    }


    return menu;
  }

  hideFromSummary(countryName: any) {
    debugger;
    this.filteredSummaryTableData = this.filteredSummaryTableData.filter((item: any) => {
      return item.countryName != countryName;
    });
  }

  hideCollectionCoin(collectionCoinId: any) {
    this.filteredTableData = this.filteredTableData.filter((item: any) => {
      return item.id != collectionCoinId;
    });
  }

  async loadGrid(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.loaderService.showLoader(UIStrings.LOADERS.LOADING_CURRENCY_DATA);
      // Check cache
      const cacheKey = NavigationURLs.CURRENCY_LIST;
      const cachedData = this.cacheService.get<any[]>(cacheKey);

      if (cachedData) {
        this.tableData = cachedData;
        this.filteredTableData = cachedData;
        this.filteredCoinList = cachedData;
        this.loaderService.hideLoader();
        resolve();   // IMPORTANT
        return;
      }

      this.currencyCoinService.getCurrencyCoinRecords().subscribe({
        next: (res: any) => {
          this.tableData = res.data;
          this.filteredTableData = res.data;
          this.filteredCoinList = res.data;

          this.cacheService.set(cacheKey, res.data);
          this.loading = false;
          this.loaderService.hideLoader();

          resolve(); // IMPORTANT — marks completion
        },
        error: (err: any) => {
          this.loaderService.hideLoader();
          reject(err); // IMPORTANT — in case of error
        }
      });
    });
  }

  LoadSummaryGrid() {
    const cacheKey = NavigationURLs.CURRENCY_SUMMARY;
    const cachedData = this.cacheService.get<any[]>(cacheKey);
    if (cachedData) {
      this.summaryTableData = cachedData;
      this.filteredSummaryTableData = cachedData;
      this.loaderService.hideLoader();
      return;
    }
    this.loaderService.showLoader('Loading currency summary...');
    this.currencyCoinService.getCurrencyCoinSummary().subscribe({
      next: (res: any) => {
        this.summaryTableData = res.data;
        this.filteredSummaryTableData = res.data;
        this.cacheService.set(cacheKey, res.data);
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
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
    this.searchText = event.target.value.toLowerCase();
    this.applyFilters();
  }

  currencyCoinDetails(data: any) {
    this.currencyCoinDetailsComponent.openDetailsPopup(data);
    setTimeout(() => {
      const btn = document.querySelector('#openDetailsButton') as HTMLElement | null;
      if (btn) btn.click();
      else console.error('openDetailsButton not found');
    }, 120);
  }

  approveCurrencyCoin(data: any) {
    this.currencyCoinService.approveCurrencyCoin(data).subscribe({
      next: (res: any) => {
        this.toaster.showMessage("Record Approved Successfully.", "success");
        this.reloadData();
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
      },
    });
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
    if (isConfirmed) {

      this.currencyCoinService.deleteCurrencyCoin(this.currencyCoinId).subscribe({
        next: (res: any) => {
          this.toaster.showMessage("Record Deleted Successfully.", "success");
          this.reloadData();
        },
        error: (error: any) => {
          this.loaderService.hideLoader();
        },
      });
    }
  }

  applyFilters() {
    const filtered = this.tableData.filter((item: any) => {
      const matchesCoinName = item.coinNoteName?.toLowerCase().includes(this.searchText);
      const matchesCountryName = item.countryName?.toLowerCase().includes(this.searchText);
      const matchesCurrencyType = item.currencyCoinType?.toLowerCase().includes(this.searchText);
      const matchesActulaValue = item.actualValue?.toString()?.toLowerCase().includes(this.searchText);
      const matchesIndianValue = item.indianValue?.toString()?.toLowerCase().includes(this.searchText);
      const matchesDescription = item.description?.toLowerCase().includes(this.searchText);
      const matchesGeneratedDescription = item.generatedDescription?.toLowerCase().includes(this.searchText);
      const matchesExtractedText = item.extractedText?.toLowerCase().includes(this.searchText);

      const matchesCountry =
        this.selectedCountry.length === 0 ||
        this.selectedCountry.includes(item.countryName);

      const matchesType =
        this.selectedType.length === 0 ||
        this.selectedType.includes(item.currencyCoinType);

      return (matchesCoinName || matchesCountryName || matchesActulaValue || matchesIndianValue || matchesDescription || matchesGeneratedDescription || matchesExtractedText || matchesCurrencyType) && matchesCountry && matchesType;
    });
    this.filteredTableData = filtered;
    this.filteredCoinList = filtered as any[];

    const filteredSummary = this.summaryTableData.filter((item: any) => {
      const matchesCountryName = item.countryName?.toLowerCase().includes(this.searchText);
      const matchesCurrencyName = item.currencyName?.toLowerCase().includes(this.searchText);
      const matchesCurrencyCode = item.currencyCode?.toLowerCase().includes(this.searchText);
      const matchesCurrencySymbol = item.currencySymbol?.toLowerCase().includes(this.searchText);
      const matchesCoinCount = item.numberOfCoins == this.searchText;
      const matchesNoteCount = item.numberOfNotes == this.searchText;
      const matchesTotalCount = item.total == this.searchText;

      const matchesCountry =
        this.selectedCountry.length === 0 ||
        this.selectedCountry.includes(item.countryName);

      return (matchesCountryName || matchesCurrencyName || matchesCurrencyCode || matchesCurrencySymbol || matchesCoinCount || matchesNoteCount || matchesTotalCount) && matchesCountry;
    });
    this.filteredSummaryTableData = filteredSummary;
  }


  // toggleAllCountryCheck(event: Event) {
  //   const checked = (event.target as HTMLInputElement).checked;
  //   if (checked) {
  //     this.selectedCountry = this.countryList.map((m: any) => m.country);
  //   } else {
  //     this.selectedCountry = [];
  //   }
  //   this.getCountryDropdownLabel();
  //   this.applyFilters();
  // }

  // toggleCountryCheck(event: Event, countryName: string) {
  //   const checked = (event.target as HTMLInputElement).checked;
  //   if (checked) {
  //     this.selectedCountry.push(countryName);
  //   } else {
  //     this.selectedCountry = this.selectedCountry.filter((m) => m !== countryName);
  //   }
  //   this.getCountryDropdownLabel();
  //   this.applyFilters();
  // }

  // getCountryDropdownLabel() {
  //   if (this.selectedCountry.length === 0) {
  //     this.lableForCountryDropDown = "";
  //   } else if (this.selectedCountry.length === this.countryList.length) {
  //     this.lableForCountryDropDown = "All";
  //   } else {
  //     this.lableForCountryDropDown = this.selectedCountry.join(", ");
  //   }
  //   this.filteredTypes();
  // }

  toggleAllTypeCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedType = this.typeList.map((m: any) => m.listItemName);
    } else {
      this.selectedType = [];
    }
    this.getTypeDropdownLabel();
    this.applyFilters();
  }

  toggleTypeCheck(event: Event, typeName: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedType.push(typeName);
    } else {
      this.selectedType = this.selectedType.filter((m) => m !== typeName);
    }
    this.getTypeDropdownLabel();
    this.applyFilters();
  }

  getTypeDropdownLabel() {
    if (this.selectedType.length === 0) {
      this.lableForTypeDropDown = "";
    } else if (this.selectedType.length === this.typeList.length) {
      this.lableForTypeDropDown = "All";
    } else {
      this.lableForTypeDropDown = this.selectedType.join(", ");
    }
  }

  setView(mode: 'grid' | 'gallery' | 'summary' | 'news') {
    // this.selectDefaultIndia();
    this.viewMode = mode;
  }
  redirectToOwnersProfile() {
    window.open(NavigationURLs.OWNER_PROFILE, '_blank');
  }
}


