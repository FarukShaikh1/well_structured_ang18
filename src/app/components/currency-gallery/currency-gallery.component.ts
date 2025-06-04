import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CurrencyCoinService } from '../../services/currency-coin/currency-coin.service';
import { CurrencyCoinDetailsComponent } from '../currency-coin-details/currency-coin-details.component'
import { CommonModule } from '@angular/common';
import { API_URL } from '../../../utils/api-url';
import { ColumnDefinition, CellComponent } from 'tabulator-tables';
import { ApplicationTableConstants, DBConstants, NavigationURLs } from '../../../utils/application-constants';
import { TabulatorGridComponent } from "../shared/tabulator-grid/tabulator-grid.component";
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-currency-gallery',
  standalone: true,
  templateUrl: './currency-gallery.component.html',
  imports: [CommonModule, TabulatorGridComponent, ConfirmationDialogComponent, CurrencyCoinDetailsComponent],
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
        console.log('this.coinList : ',this.coinList);
        
        // // If your API doesn't return full image URLs, build them
        // this.images = this.coinList.map(coin =>
        //   coin.assetId ? API_URL.ATTACHMENT + coin.imagePath : null
        // ).filter(img => img != null);

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
            console.log('currencyTypeList : ',this.currencyTypeList);
            
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
debugger
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

    currencyCoinList(){
      this.router.navigate([NavigationURLs.CURRENCY_LIST]);
    }
  
  applyFilters() {
    this.filteredCoinList = this.coinList.filter((item: any) => {
      const matchesCoinName = item.collectionCoinName?.toLowerCase().includes(this.searchText);
      const matchesCountryName = item.countryName?.toLowerCase().includes(this.searchText);
      const matchesActulaValue = item.actualValue?.toString()?.toLowerCase().includes(this.searchText);
      const matchesIndianValue = item.indianValue?.toString()?.toLowerCase().includes(this.searchText);
      const matchesDescription = item.description?.toLowerCase().includes(this.searchText);
      return matchesCoinName || matchesCountryName || matchesActulaValue || matchesIndianValue || matchesDescription;
    });
  }
}


