import { PaginationStatus } from '../app/interfaces/pagination-status';
import { GlobalService } from '../app/services/global/global.service';
import { Injectable } from '@angular/core';
import { ApplicationConstants, ApplicationTableConstants } from './application-constants';

@Injectable({
  providedIn: 'root', // This provides the service at the root level
})
export class TableUtils {
  totalRecords: number = 0;
  dataToDisplayInGrid: any;
  isDisabledNextBtn: boolean = false;
  isDisabledPrevBtn: boolean = false;
  paginationCountingMessage: string = '';
  pageSizeOptions = ApplicationTableConstants.PAGE_SIZE_OPTIONS;

  paginationStatus: PaginationStatus = {
    selectedPage: 1,
    itemsPerPage: ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE,
    totalPages: 0,
  };

  constructor(private globalService: GlobalService) { }

  onSortClick(event: any, column: string, moduleName: string) {
    const target = event.currentTarget;
    const classList = target.classList;
    let sortDir = 0;
    if (
      !classList.contains('bi-arrow-up') &&
      !classList.contains('bi-arrow-down')
    ) {
      // First click, set to ascending order
      classList.add('bi-arrow-up');
      sortDir = 1;
    } else if (classList.contains('bi-arrow-up')) {
      // Second click, set to descending order
      classList.remove('bi-arrow-up');
      classList.add('bi-arrow-down');
      sortDir = -1;
    } else {
      // Third click, reset sorting
      classList.remove('bi-arrow-up', 'bi-arrow-down'); // Remove both classes
    }
    this.sortArray(column, moduleName, sortDir); // Use the provided column parameter here
  }

  sortArray(key: string, moduleName: string, sortDir: number) {
    // Sort the data based on the column and sorting direction
    if (sortDir === 1) {
      // Sort in ascending order
      this.dataToDisplayInGrid.sort((a: any, b: any) => {
        const valueA = a[key];
        const valueB = b[key];
        return valueA?.toString().localeCompare(valueB.toString() );
      });
    } else if (sortDir === -1) {
      // Sort in descending order
      this.dataToDisplayInGrid.sort((a: any, b: any) => {
        const valueA = a[key];
        const valueB = b[key];
        return valueB?.toString().localeCompare(valueA.toString() );
      });
    } else {
      this.globalService.triggerApplyFilter(moduleName);
    }
  }

  displayCountingMessage(filteredDataSource: any) {
    const itemsPerPage = this.paginationStatus.itemsPerPage;
    const totalRecords = filteredDataSource?.length;
    const selectedPage = this.paginationStatus.selectedPage;

    let startRecord = (selectedPage - 1) * itemsPerPage + 1;
    startRecord = filteredDataSource?.length > 0 ? startRecord : 0;
    let endRecord = selectedPage * itemsPerPage;
    endRecord = Math.min(endRecord, totalRecords);
    this.paginationCountingMessage =
      'Showing ' +
      startRecord +
      '-' +
      endRecord +
      ' ' +
      ' Out Of ' +
      filteredDataSource.length +
      ' records.';
  }

  pageChange(selectedPage: number, filteredDataSource: any) {
    this.paginationStatus = {
      ...this.paginationStatus,
      selectedPage: selectedPage,
    };
    this.refreshTable(false, filteredDataSource);
  }

  nextPage(filteredDataSource: any) {
    this.paginationStatus = {
      ...this.paginationStatus,
      selectedPage: this.paginationStatus.selectedPage + 1,
    };
    this.refreshTable(false, filteredDataSource);
  }

  previousPage(filteredDataSource: any) {
    this.paginationStatus = {
      ...this.paginationStatus,
      selectedPage:
        this.paginationStatus.selectedPage !== 1
          ? this.paginationStatus.selectedPage - 1
          : 1,
    };
    this.refreshTable(false, filteredDataSource);
  }

  getPagesToDisplay(): number[] {
    const total = this.paginationStatus.totalPages;
    const current = this.paginationStatus.selectedPage;
    const delta = 2; // Number of pages to show around the current page
    const pages = [];

    // Determine range start and end
    let rangeStart = Math.max(2, current - delta);
    let rangeEnd = Math.min(total - 1, current + delta);

    // Adjust range to always show at least delta * 2 + 1 pages
    if (current - delta <= 1) {
      rangeEnd = Math.min(total - 1, rangeEnd + (delta - current + 1));
    }
    if (current + delta >= total) {
      rangeStart = Math.max(2, rangeStart - (current + delta - total + 1));
    }

    // Push the range of pages into the array
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    return pages;
  }

  shouldShowLeftEllipsis(): boolean {
    return this.paginationStatus.selectedPage > 4;
  }

  shouldShowRightEllipsis(): boolean {
    return (
      this.paginationStatus.selectedPage < this.paginationStatus.totalPages - 3
    );
  }

  initialPagination(filteredDataSource: any) {
    this.totalRecords = Object.keys(filteredDataSource).length;
    this.paginationStatus = {
      ...this.paginationStatus,
      totalPages: Math.ceil(
        this.totalRecords / this.paginationStatus.itemsPerPage
      ),
    };
    this.refreshTable(false, filteredDataSource);
  }

  refreshTable(filterApplied: boolean, filteredDataSource: any) {
    if (filterApplied) {
      this.paginationStatus.selectedPage = 1;
    }
    this.totalRecords = filteredDataSource?.length;
    this.paginationStatus.totalPages = Math.ceil(
      this.totalRecords / this.paginationStatus.itemsPerPage
    );
    this.dataToDisplayInGrid = filteredDataSource?.slice(
      Number(this.paginationStatus.selectedPage - 1) *
      Number(this.paginationStatus.itemsPerPage),
      Number(this.paginationStatus.selectedPage - 1) *
      Number(this.paginationStatus.itemsPerPage) +
      Number(this.paginationStatus.itemsPerPage)
    );
    this.handelPrevAndNext(filteredDataSource);
  }

  handelPrevAndNext(filteredDataSource: any) {
    this.displayCountingMessage(filteredDataSource);
    this.isDisabledNextBtn =
      this.paginationStatus.selectedPage >= this.paginationStatus.totalPages;
    this.isDisabledPrevBtn = this.paginationStatus.selectedPage <= 1;
  }

  onItemsPerPageChange(event: any, moduleName: string) {
    this.paginationStatus.itemsPerPage = event.target.value;
    if (String(this.paginationStatus.itemsPerPage) === ApplicationConstants.SELECT_ALL) {
      this.paginationStatus.itemsPerPage = this.totalRecords;
    }
    this.paginationStatus.selectedPage = 1; // Reset to the first currentPage
    this.globalService.triggerApplyFilter(moduleName);
  }
}
