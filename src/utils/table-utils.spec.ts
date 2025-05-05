// import { TestBed } from '@angular/core/testing';
// import { TableUtils } from './table-utils';
// import { GlobalService } from '../../services/global/global.service';
// import { ClientMockDataService } from '../test-helpers/client-mock-data.service';
// import { ApplicationConstants } from './application-constants';

// describe('TableUtils', () => {
//     let tableUtils: TableUtils;
//     let mockGlobalService: jasmine.SpyObj<GlobalService>;
//     let mockEvent: any;

//     beforeEach(() => {
//         mockGlobalService = jasmine.createSpyObj('GlobalService', ['triggerApplyFilter']);
//         TestBed.configureTestingModule({
//             providers: [
//                 TableUtils,
//                 { provide: GlobalService, useValue: mockGlobalService }
//             ]
//         });
//         tableUtils = TestBed.inject(TableUtils);
//         tableUtils.dataToDisplayInGrid = ClientMockDataService.getClientList();

//         // Mocking the event with a target having classList
//         mockEvent = {
//             currentTarget: {
//                 classList: {
//                     contains: jasmine.createSpy('contains'),
//                     add: jasmine.createSpy('add'),
//                     remove: jasmine.createSpy('remove'),
//                 }
//             }
//         };
//     });

//     it('should set ascending order on first click', () => {
//         // Simulate no sort classes present
//         mockEvent.currentTarget.classList.contains.and.returnValue(false);

//         tableUtils.onSortClick(mockEvent, 'name', 'clients');

//         expect(mockEvent.currentTarget.classList.add).toHaveBeenCalledWith('bi-arrow-up');
//         expect(mockEvent.currentTarget.classList.remove).not.toHaveBeenCalled();
//         expect(tableUtils.dataToDisplayInGrid[0].name).toBe('Cipla'); // Assuming 'Cipla' should be first in ascending order
//         expect(mockGlobalService.triggerApplyFilter).not.toHaveBeenCalled();
//     });

//     it('should set descending order on second click', () => {
//         // Simulate the ascending sort class present
//         mockEvent.currentTarget.classList.contains.and.callFake((className: string) => className === 'bi-arrow-up');

//         tableUtils.onSortClick(mockEvent, 'name', 'clients');

//         expect(mockEvent.currentTarget.classList.remove).toHaveBeenCalledWith('bi-arrow-up');
//         expect(mockEvent.currentTarget.classList.add).toHaveBeenCalledWith('bi-arrow-down');
//         expect(tableUtils.dataToDisplayInGrid[0].name).toBe('Symboisis'); // Assuming 'Symboisis' should be first in descending order
//         expect(mockGlobalService.triggerApplyFilter).not.toHaveBeenCalled();
//     });

//     it('should reset sorting on third click', () => {
//         // Simulate the descending sort class present
//         mockEvent.currentTarget.classList.contains.and.callFake((className: string) => className === 'bi-arrow-down');

//         tableUtils.onSortClick(mockEvent, 'name', 'clients');

//         // Check that remove was called with both 'bi-arrow-up' and 'bi-arrow-down' together
//         expect(mockEvent.currentTarget.classList.remove.calls.argsFor(0)).toEqual(['bi-arrow-up', 'bi-arrow-down']);
//         expect(mockGlobalService.triggerApplyFilter).toHaveBeenCalledWith('clients');
//     });

//     describe('previousPage():', () => {
//         it('should decrement the selected page if it is greater than 1', () => {
//             // Arrange
//             const filteredDataSource = ClientMockDataService.getClientList();
//             tableUtils.paginationStatus = { selectedPage: 2, itemsPerPage: 10, totalPages: 5 };

//             spyOn(tableUtils, 'refreshTable');

//             // Act
//             tableUtils.previousPage(filteredDataSource);

//             // Assert
//             expect(tableUtils.paginationStatus.selectedPage).toBe(1);
//             expect(tableUtils.refreshTable).toHaveBeenCalledWith(false, filteredDataSource);
//         });

//         it('should not decrement the selected page if it is already 1', () => {
//             // Arrange
//             const filteredDataSource = ClientMockDataService.getClientList();
//             tableUtils.paginationStatus = { selectedPage: 2, itemsPerPage: 10, totalPages: 5 };

//             spyOn(tableUtils, 'refreshTable');

//             // Act
//             tableUtils.previousPage(filteredDataSource);

//             // Assert
//             expect(tableUtils.paginationStatus.selectedPage).toBe(1);
//             expect(tableUtils.refreshTable).toHaveBeenCalledWith(false, filteredDataSource);
//         });

//     });

//     describe('pageChange', () => {

//         beforeEach(() => {
//             tableUtils.paginationStatus = { selectedPage: 1, itemsPerPage: 10, totalPages: 5 };
//             spyOn(tableUtils, 'refreshTable');
//         });

//         it('should update the selected page and refresh the table', () => {
//             const selectedPage = 3;
//             const filteredDataSource = ClientMockDataService.getClientList();

//             // Act
//             tableUtils.pageChange(selectedPage, filteredDataSource);

//             // Assert
//             expect(tableUtils.paginationStatus.selectedPage).toBe(selectedPage);
//             expect(tableUtils.refreshTable).toHaveBeenCalledWith(false, filteredDataSource);
//         });

//         it('should update the selected page even if it is the same as the current page', () => {
//             // Arrange
//             const selectedPage = tableUtils.paginationStatus.selectedPage;
//             const filteredDataSource = ClientMockDataService.getClientList();

//             // Act
//             tableUtils.pageChange(selectedPage, filteredDataSource);

//             // Assert
//             expect(tableUtils.paginationStatus.selectedPage).toBe(selectedPage);
//             expect(tableUtils.refreshTable).toHaveBeenCalledWith(false, filteredDataSource);
//         });

//         it('should update the selected page if it is the last page', () => {
//             // Arrange
//             const selectedPage = tableUtils.paginationStatus.totalPages;
//             const filteredDataSource = ClientMockDataService.getClientList();

//             // Act
//             tableUtils.pageChange(selectedPage, filteredDataSource);

//             // Assert
//             expect(tableUtils.paginationStatus.selectedPage).toBe(selectedPage);
//             expect(tableUtils.refreshTable).toHaveBeenCalledWith(false, filteredDataSource);
//         });
//     });

//     describe('nextPage', () => {
//         // let tableUtils: TableUtils;

//         // beforeEach(() => {
//         //   tableUtils = new TableUtils();
//         // });

//         it('should increment the selected page by 1', () => {
//             // Arrange
//             const filteredDataSource = ClientMockDataService.getClientList();
//             tableUtils.paginationStatus = { selectedPage: 1, itemsPerPage: 10, totalPages: 5 };

//             spyOn(tableUtils, 'refreshTable');

//             // Act
//             tableUtils.nextPage(filteredDataSource);

//             // Assert
//             expect(tableUtils.paginationStatus.selectedPage).toBe(2);
//             expect(tableUtils.refreshTable).toHaveBeenCalledWith(false, filteredDataSource);
//         });

//         it('should handle the case when selectedPage is at the last page', () => {
//             // Arrange
//             const filteredDataSource = ClientMockDataService.getClientList();
//             tableUtils.paginationStatus = { selectedPage: 5, itemsPerPage: 10, totalPages: 5 };

//             spyOn(tableUtils, 'refreshTable');

//             // Act
//             tableUtils.nextPage(filteredDataSource);

//             // Assert
//             expect(tableUtils.paginationStatus.selectedPage).toBe(6); // even though it exceeds totalPages
//             expect(tableUtils.refreshTable).toHaveBeenCalledWith(false, filteredDataSource);
//         });
//     });

//     describe('getPagesToDisplay', () => {

//         it('should return a range of pages centered around the current page', () => {
//             tableUtils.paginationStatus = {
//                 selectedPage: 1,
//                 itemsPerPage: 10,
//                 totalPages: 10,
//             };
//             // Arrange
//             tableUtils.paginationStatus.selectedPage = 5;

//             // Act
//             const pages = tableUtils.getPagesToDisplay();

//             // Assert
//             expect(pages).toEqual([3, 4, 5, 6, 7]);
//         });

//         it('should adjust range to include more pages at the start if near the beginning', () => {
//             tableUtils.paginationStatus = {
//                 selectedPage: 1,
//                 itemsPerPage: 10,
//                 totalPages: 10,
//             };

//             // Arrange
//             tableUtils.paginationStatus.selectedPage = 2;

//             // Act
//             const pages = tableUtils.getPagesToDisplay();

//             // Assert
//             expect(pages).toEqual([2, 3, 4, 5]);
//         });

//         it('should adjust range to include more pages at the end if near the last page', () => {
//             tableUtils.paginationStatus = {
//                 selectedPage: 9,
//                 itemsPerPage: 10,
//                 totalPages: 10,
//             };

//             // Act
//             const pages = tableUtils.getPagesToDisplay();

//             // Assert
//             expect(pages).toEqual([5, 6, 7, 8, 9]);
//         });

//         it('should return an empty array if there are no pages to display', () => {
//             tableUtils.paginationStatus = {
//                 selectedPage: 9,
//                 itemsPerPage: 10,
//                 totalPages: 10,
//             };
//             // Arrange
//             tableUtils.paginationStatus.selectedPage = 1;
//             tableUtils.paginationStatus.totalPages = 1;

//             // Act
//             const pages = tableUtils.getPagesToDisplay();

//             // Assert
//             expect(pages).toEqual([]);
//         });

//         it('should return an empty array if there are no pages to display', () => {
//             // Arrange
//             tableUtils.paginationStatus = {
//                 selectedPage: 1,
//                 itemsPerPage: 10,
//                 totalPages: 1,
//             };

//             // Act
//             const pages = tableUtils.getPagesToDisplay();

//             // Assert
//             expect(pages).toEqual([]);
//         });

//         it('should handle edge cases where the current page is at the end', () => {
//             // Arrange
//             tableUtils.paginationStatus.selectedPage = 10;
//             tableUtils.paginationStatus.totalPages = 10;

//             // Act
//             const pages = tableUtils.getPagesToDisplay();

//             // Assert
//             expect(pages).toEqual([5, 6, 7, 8, 9]);
//         });
//     });

//     describe('onItemsPerPageChange', () => {
//         let tableUtils: TableUtils;
//         let globalService: GlobalService;

//         beforeEach(() => {
//             globalService = jasmine.createSpyObj('GlobalService', ['triggerApplyFilter']);
//             tableUtils = new TableUtils(globalService);
//             tableUtils.paginationStatus = {
//                 selectedPage: 1,
//                 itemsPerPage: 10,
//                 totalPages: 5,
//             };
//         });

//         it('should update itemsPerPage and reset selectedPage to 1', () => {
//             // Arrange
//             const event = { target: { value: 20 } };
//             const moduleName = 'testModule';

//             // Act
//             tableUtils.onItemsPerPageChange(event, moduleName);

//             // Assert
//             expect(tableUtils.paginationStatus.itemsPerPage).toBe(20);
//             expect(tableUtils.paginationStatus.selectedPage).toBe(1);
//             expect(globalService.triggerApplyFilter).toHaveBeenCalledWith(moduleName);
//         });

//         it('should set itemsPerPage to totalRecords if value is "SELECT_ALL"', () => {
//             // Arrange
//             const event = { target: { value: ApplicationConstants.SELECT_ALL } };
//             tableUtils.totalRecords = 100;
//             const moduleName = 'testModule';

//             // Act
//             tableUtils.onItemsPerPageChange(event, moduleName);

//             // Assert
//             expect(tableUtils.paginationStatus.itemsPerPage).toBe(100);
//             expect(tableUtils.paginationStatus.selectedPage).toBe(1);
//             expect(globalService.triggerApplyFilter).toHaveBeenCalledWith(moduleName);
//         });
//     });

//     describe('shouldShowLeftEllipsis', () => {

//         beforeEach(() => {
//             tableUtils.paginationStatus = {
//                 selectedPage: 1,
//                 itemsPerPage: 10,
//                 totalPages: 10,
//             };
//         });

//         it('should return false when selectedPage is 4 or less', () => {
//             // Test cases where selectedPage is 1, 2, 3, and 4
//             for (let i = 1; i <= 4; i++) {
//                 tableUtils.paginationStatus.selectedPage = i;
//                 expect(tableUtils.shouldShowLeftEllipsis()).toBeFalse();
//             }
//         });

//         it('should return true when selectedPage is greater than 4', () => {
//             // Test cases where selectedPage is 5, 6, 7, etc.
//             for (let i = 5; i <= 10; i++) {
//                 tableUtils.paginationStatus.selectedPage = i;
//                 expect(tableUtils.shouldShowLeftEllipsis()).toBeTrue();
//             }
//         });
//     });

//     describe('shouldShowRightEllipsis', () => {

//         beforeEach(() => {
//             tableUtils.paginationStatus = {
//                 selectedPage: 1,
//                 itemsPerPage: 10,
//                 totalPages: 10,
//             };
//         });

//         it('should return true when selectedPage is less than totalPages minus 3', () => {
//             // Test cases where selectedPage is 1 to 6
//             for (let i = 1; i <= 6; i++) {
//                 tableUtils.paginationStatus.selectedPage = i;
//                 expect(tableUtils.shouldShowRightEllipsis()).toBeTrue();
//             }
//         });

//         it('should return false when selectedPage is equal to or greater than totalPages minus 3', () => {
//             // Test cases where selectedPage is 7, 8, 9, or 10
//             for (let i = 7; i <= 10; i++) {
//                 tableUtils.paginationStatus.selectedPage = i;
//                 expect(tableUtils.shouldShowRightEllipsis()).toBeFalse();
//             }
//         });
//     });
// });
