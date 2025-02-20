import { Component } from '@angular/core';
import { CurrencyCoinService } from '../../services/currency-coin/currency-coin.service';
import { CurrencyCoinDetailsComponent } from '../currency-coin-details/currency-coin-details.component'
import * as constants from '../../../utils/constants'
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-currency',
  standalone:true,
  templateUrl: './currency-coin.component.html',
  imports:[CommonModule],
  styleUrls: ['./currency-coin.component.scss']
})
export class CurrencyCoinComponent {
  displayedColumns: string[] = [];
  imageList: any;
  dataSource: any;
  basePath: string = constants.ATTACHMENT;
  selectedTabIndex: number = 0;
  sort: any;
  paginator: any;
  coinSelected: number[] = [];
  filteredDataSource: any;
  searchText: string = '';
  selectedData!: { value: any; text: any; };
  selectedCount: number = 0;
  key: string = 'archiveAdminData.name';
  reverse: boolean = false;
  isAllChecked: boolean = false;
  sortDir = 1;
  sortClickCount = 0;
  selectedCheckboxMap: { [key: number]: boolean } = {};
  page: number = 1;
  count: number = 0;
  itemCountList: string = '';
  pageSizeOptions = [10, 15, 20, 50, 100, 500, 1000];
  itemsPerPage = 10;

  constructor( private _currencyCoinService: CurrencyCoinService) {

  }


  ngOnInit() {
    this.selectedTabIndex = 0;
    this.basePath = constants.ATTACHMENT;
    this.getCurrencyCoinRecords();

  }

  getCurrencyCoinRecords() {
    this._currencyCoinService.getCurrencyCoinRecords().subscribe((res) => {
      this.displayedColumns = ['collectionCoinId', 'collectionCoinName', 'countryName', 'actualValue', 'indianValue', 'description', 'edit'];
      this.imageList = res;


      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
    )
  }


  currencyCoinDetails(data: any) {
  }

  itemcount(): string {
    const recordsPerPage = this.itemsPerPage;
    const totalRecords = this.filteredDataSource?.length;
    const currentPage = this.page;
    let startRecord = (currentPage - 1) * recordsPerPage + 1;
    startRecord = this.filteredDataSource?.length > 0 ? startRecord : 0;
    let endRecord = currentPage * recordsPerPage;
    endRecord = Math.min(endRecord, totalRecords);

    return startRecord + '-' + endRecord;
  }

  sortarr(key: string) {
    if (this.key === key) {
      if (this.reverse) {
        this.reverse = false;
      } else {
        this.reverse = true;
      }
    } else {
      this.key = key;
      this.reverse = false;
    }

    if (!this.reverse) {
      this.dataSource.sort((a: any, b: any) => {
        const valueA = a[key]?.toLowerCase();
        const valueB = b[key]?.toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      this.dataSource.sort((a: any, b: any) => {
        const valueA = a[key]?.toLowerCase();
        const valueB = b[key]?.toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    this.sortClickCount++;

    if (this.sortClickCount === 3) {
      this.sortClickCount = 0;
      this.getCurrencyCoinRecords();
    }
  }

  onSortClick(event: any, column: string) {
    const target = event.currentTarget;
    const classList = target.classList;

    if (
      !classList.contains('bi-arrow-up') &&
      !classList.contains('bi-arrow-down')
    ) {
      classList.add('bi-arrow-up');
      this.sortDir = 1;
    } else if (classList.contains('bi-arrow-up')) {
      classList.remove('bi-arrow-up');
      classList.add('bi-arrow-down');
      this.sortDir = -1;
    } else {
      classList.remove('bi-arrow-up', 'bi-arrow-down');
      this.sortDir = 0;
    }

    this.sortarr(column);
  }

  checkUncheckAll(e: any, page: number) {
    this.coinSelected = [];
    this.isAllChecked = !this.isAllChecked;
    const currentPageRows = this.dataSource.slice(
      (page - 1) * 10,
      page * 10
    );

    this.dataSource.map((item: any) => {
      item.selected = this.isAllChecked;
      if (item.selected) {
        if (!this.coinSelected.includes(item)) {
          this.coinSelected.push(item.id);
        }
      } else {
        const index = this.coinSelected.indexOf(item.id);
        if (index !== -1) {
          this.coinSelected.splice(index, 1);
        }
      }
    });
    console.log('coinSelected', this.coinSelected);
  }

  isAllSelected(event: any, item: any, Index: number, pageIndex: number) {
    const currentPageRows = this.dataSource.slice(
      (pageIndex - 1) * 10,
      pageIndex * 10
    );
    this.dataSource[Index].selected = event.target.checked;
    const index = this.coinSelected.indexOf(item.id);
    if (event.target.checked) {
      this.coinSelected.push(item.id);
      this.selectedCheckboxMap[item.id] = true;
      this.selectedCount++;
    } else {
      this.coinSelected.splice(index, 1);
      this.selectedCheckboxMap[item.id] = false;
      this.selectedCount--;
    }
    const currentPage = this.page;
    this.selectedCheckboxMap[currentPage] =
      this.coinSelected.length === this.dataSource.length;
    this.isAllChecked = this.selectedCheckboxMap[currentPage];
  }

  onTableDataChange(event: any) {
    this.page = event;
  }
  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.page = 1;
    this.applyFilters();
  }
  updateDisplayedData() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredDataSource = this.filteredDataSource.slice(startIndex, endIndex);
  }
  applyFilters() {
    this.onTableDataChange(1);
    this.filteredDataSource = this.dataSource.filter((item: any) => {
      const matchesName = item.PersonName.toLowerCase().includes(this.searchText);
      return matchesName;
    });
  }


}


