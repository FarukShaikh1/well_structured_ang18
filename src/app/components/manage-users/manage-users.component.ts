import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserServiceService } from '../../services/user/user-service.service';
import { GlobalService } from '../../services/global/global.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  standalone:true,
  templateUrl: './manage-users.component.html',
  imports: [CommonModule],
  
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {
   @ViewChild('searchInput') searchInput!: ElementRef;
  displayedUserColumns: string[] = ['userId', 'personName', 'emailAddress', 'userName', 'roleName', 'modifiedBy', 'modifiedOn', 'isLocked', 'edit', 'delete'];
  usersDataSource!: any;
  filteredDataSource!: any;

  searchText: string = '';
  selectedData!: { value: any; text: any; };
  selectedCount: number = 0;
  key: string = 'Users.name';
  reverse: boolean = false;
  daySelected: number[] = [];
  isAllChecked: boolean = false;
  sortDir = 1;
  sortClickCount = 0;
  selectedCheckboxMap: { [key: number]: boolean } = {};
  page: number = 1;
  count: number = 0;
  itemCountList: string = '';
  pageSizeOptions = [10, 15, 20, 50, 100, 500, 1000];
  itemsPerPage = 10;


  constructor(private _userService: UserServiceService, private _globalService: GlobalService,
      private _httpClient: HttpClient
  ) {
  }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    this._userService.getUserList().subscribe((res) => {
      this.usersDataSource = res;
      this.filteredDataSource = res;
    },
    )
  }
  applyFilters() {
    this.onTableDataChange(1);
    this.filteredDataSource = this.usersDataSource.filter((item: any) => {
      const matchesName = item.UserName.toLowerCase().includes(this.searchText);
      return matchesName;
    });
  }

  filterGridSearchText(event: Event) {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);

    this.searchText = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.applyFilters()
  }

  unlockUser(userId: number) {
  }

  editUser(userId: number) {
  }
  deleteUser(userId: number) {
  }

  itemcount(): string {
    const recordsPerPage = this.itemsPerPage;
    const totalRecords = this.filteredDataSource?.length;
    const currentPage = this.page; // Assuming this.page represents the current page number

    let startRecord = (currentPage - 1) * recordsPerPage + 1;
    startRecord = this.filteredDataSource?.length > 0 ? startRecord : 0;
    let endRecord = currentPage * recordsPerPage;
    endRecord = Math.min(endRecord, totalRecords);

    return startRecord + '-' + endRecord;
  }

  sortarr(key: string) {
    if (this.key === key) {
      if (this.reverse) {
        // Second click, set to ascending order
        this.reverse = false;
      } else {
        // First click, set to descending order
        this.reverse = true;
      }
    } else {
      // Clicking a different column, reset sorting and sorting direction
      this.key = key;
      this.reverse = false;
    }

    // Sort the data based on the column and sorting direction
    if (!this.reverse) {
      // Sort in ascending order
      this.filteredDataSource.sort((a: any, b: any) => {
        const valueA = a[key]?.toLowerCase();
        const valueB = b[key]?.toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      // Sort in descending order
      this.filteredDataSource.sort((a: any, b: any) => {
        const valueA = a[key]?.toLowerCase();
        const valueB = b[key]?.toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    this.sortClickCount++;

    if (this.sortClickCount === 3) {
      // Third click, reset data to its original order
      this.sortClickCount = 0; // Reset the click count
    }
  }

  onSortClick(event: any, column: string) {
    const target = event.currentTarget;
    const classList = target.classList;

    if (
      !classList.contains('bi-arrow-up') &&
      !classList.contains('bi-arrow-down')
    ) {
      // First click, set to ascending order
      classList.add('bi-arrow-up');
      this.sortDir = 1;
    } else if (classList.contains('bi-arrow-up')) {
      // Second click, set to descending order
      classList.remove('bi-arrow-up');
      classList.add('bi-arrow-down');
      this.sortDir = -1;
    } else {
      classList.remove('bi-arrow-up', 'bi-arrow-down'); // Remove both classes
      this.sortDir = 0; // Reset sorting direction
    }

    this.sortarr(column); // Use the provided column parameter here
  }

  checkUncheckAll(e: any, page: number) {
    this.daySelected = [];
    this.isAllChecked = !this.isAllChecked;
    const currentPageRows = this.filteredDataSource.slice(
      (page - 1) * 10,
      page * 10
    );

    this.filteredDataSource.map((item: any) => {
      item.selected = this.isAllChecked;
      if (item.selected) {
        if (!this.daySelected.includes(item)) {
          this.daySelected.push(item.id);
        }
      } else {
        const index = this.daySelected.indexOf(item.id);
        if (index !== -1) {
          this.daySelected.splice(index, 1);
        }
      }
    });
    console.log('daySelected', this.daySelected);
  }

  isAllSelected(event: any, item: any, Index: number, pageIndex: number) {
    const currentPageRows = this.filteredDataSource.slice(
      (pageIndex - 1) * 10,
      pageIndex * 10
    );
    this.filteredDataSource[Index].selected = event.target.checked;
    const index = this.daySelected.indexOf(item.id);
    if (event.target.checked) {
      this.daySelected.push(item.id);
      this.selectedCheckboxMap[item.id] = true;
      this.selectedCount++;
    } else {
      this.daySelected.splice(index, 1);
      this.selectedCheckboxMap[item.id] = false;
      this.selectedCount--;
    }
    const currentPage = this.page;
    this.selectedCheckboxMap[currentPage] =
      this.daySelected.length === this.filteredDataSource.length;
    this.isAllChecked = this.selectedCheckboxMap[currentPage];
  }

  onTableDataChange(event: any) {
    this.page = event;
  }
  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.page = 1; // Reset to the first page
    this.applyFilters();
  }
  updateDisplayedData() {
    // Update the displayed data based on the current page and page size
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredDataSource = this.filteredDataSource.slice(startIndex, endIndex);
  }

}
