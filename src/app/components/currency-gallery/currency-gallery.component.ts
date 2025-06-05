import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL } from '../../../utils/api-url';
import { DBConstants, NavigationURLs } from '../../../utils/application-constants';
import { CurrencyCoinService } from '../../services/currency-coin/currency-coin.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { CurrencyCoinDetailsComponent } from '../currency-coin-details/currency-coin-details.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-currency-gallery',
  standalone: true,
  templateUrl: './currency-gallery.component.html',
  imports: [CommonModule, ConfirmationDialogComponent, CurrencyCoinDetailsComponent],
  styleUrls: ['./currency-gallery.component.scss']
})

export class CurrencyGalleryComponent implements OnInit {
  @ViewChild(CurrencyCoinDetailsComponent)
  currencyCoinDetailsComponent!: CurrencyCoinDetailsComponent;
  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;

  @ViewChild("searchInput") searchInput!: ElementRef;
  basePath: string = API_URL.ATTACHMENT;
  searchText: string = '';
  currencyCoinId: string = '';
  coinList: any[] = [];
  filteredCoinList: any[] = [];
  images: any;
  currencyTypeList: any;
  countryList: any;
  lableForTypeDropDown = "";
  typeList: any;
  selectedTypes: string[] = []; // Array to store selected months
  selectedCountries: string[] = []; // Array to store selected months
  lableForCountryDropDown: string = '';

  constructor(
    private router: Router,
    private currencyCoinService: CurrencyCoinService,
    public globalService: GlobalService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.currencyCoinService.getCurrencyCoinRecords().subscribe({
      next: (res: any) => {
        this.coinList = res;
        this.filteredCoinList = res;
        console.log('this.coinList : ', this.coinList);
                this.getTypeDropdownLabel();
        this.applyFilters();

        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    },
    );

    this.globalService.getCommonListItems(DBConstants.COINTYPE).subscribe({
      next: (res: any) => {
        this.currencyTypeList = res;
        console.log('currencyTypeList : ', this.currencyTypeList);

        this.selectedTypes.push('Indian Rare Coin');

        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });

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
        },
        error: (error: any) => {
          console.log("error : ", error);
          this.loaderService.hideLoader();
        },
      });
    }
  }

  currencyCoinList() {
    this.router.navigate([NavigationURLs.CURRENCY_LIST]);
  }

  applyFilters() {
    const searchText = this.searchText?.toLowerCase() || '';
    this.filteredCoinList = this.coinList.filter((item: any) => {
      // Text search logic
      const matchesText =
        !searchText ||
        item.collectionCoinName?.toLowerCase().includes(searchText) ||
        item.countryName?.toLowerCase().includes(searchText) ||
        item.actualValue?.toString().toLowerCase().includes(searchText) ||
        item.indianValue?.toString().toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText);

      // Multi-select dropdown logic
      const matchesCurrencyType =
        this.selectedTypes?.length === 0 ||
        this.selectedTypes.includes(item.collectionCurrencyType);

      const matchesCountry =
        this.selectedCountries?.length === 0 ||
        this.selectedCountries?.includes(item.countryName);

      // Combine logic: text search + multi-select filters (AND logic for filters)
      return matchesText && matchesCurrencyType && matchesCountry;
    });
  }

  // Handle "Select All" checkbox
  toggleAllTypeCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedTypes = checked
      ? this.typeList.map((m: any) => m.listItemName)
      : [];
    this.getTypeDropdownLabel();
    this.applyFilters();
  }
  // Handle individual type selection
  toggleTypeCheck(event: Event, typeName: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedTypes.push(typeName);
    } else {
      this.selectedTypes = this.selectedTypes.filter((m) => m !== typeName);
    }
    this.getTypeDropdownLabel();
    this.applyFilters();
  }
  getTypeDropdownLabel() {
    if (this.selectedTypes?.length === 0) {
      this.lableForTypeDropDown = "";
    } else if (this.selectedTypes?.length === this.typeList?.length) {
      this.lableForTypeDropDown = "All";
    } else {
      this.lableForTypeDropDown = this.selectedTypes.join(", ");
    }
  }




  // Handle "Select All" checkbox
  toggleAllCountryCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedCountries = checked
      ? this.countryList.map((m: any) => m.countryName)
      : [];
    this.getCountryDropdownLabel();
    this.applyFilters();
  }
  // Handle individual country selection
  toggleCountryCheck(event: Event, countryName: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCountries?.push(countryName);
    } else {
      this.selectedCountries = this.selectedCountries?.filter((m: string) => m !== countryName);
    }
    this.getCountryDropdownLabel();
    this.applyFilters();
  }
  getCountryDropdownLabel() {
    if (this.selectedCountries?.length === 0) {
      this.lableForCountryDropDown = "";
    } else if (this.selectedCountries?.length === this.countryList?.length) {
      this.lableForCountryDropDown = "All";
    } else {
      this.lableForCountryDropDown = this.selectedCountries?.join(", ");
    }
  }


}


