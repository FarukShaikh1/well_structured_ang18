// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { of, Subject, throwError } from 'rxjs';
// import { GlobalService } from '../../services/global/global.service';
// import { LoaderService } from '../../services/loader/loader.service';
// import { UserService } from '../../services/user/user.service';
// import { ToasterComponent } from '../shared/toaster/toaster.component';
// import { UserMockDataService } from '../../test-helpers/user-mock-data.service';
// import { Messages, SKPTModules } from '../../utils/application-constants';
// import { UserDetailsComponent } from '../user-details/user-details.component';
// import { UserListComponent } from './user-list.component';

// describe('UserListComponent', () => {
//   let component: UserListComponent;
//   let fixture: ComponentFixture<UserListComponent>;
//   let userServiceMock: any; // Declare the variable
//   let globalServiceMock: any;
//   let loaderService: LoaderService;
//   let userDetailsComponentMock: jasmine.SpyObj<UserDetailsComponent>;

//   beforeEach(async () => {
//     userServiceMock = jasmine.createSpyObj('UserService', ['getAllUsers']);

//     globalServiceMock = {
//       reloadGrid$: new Subject<string>(),
//       refreshList$: new Subject<string>(),
//       triggerApplyFilter: jasmine.createSpy('triggerApplyFilter'),
//     };

//     userDetailsComponentMock = jasmine.createSpyObj('UserDetailsComponent', ['openUserDetailsPopup']);

//     await TestBed.configureTestingModule({
//     imports: [UserListComponent, ToasterComponent],
//     providers: [{ provide: GlobalService, useValue: globalServiceMock }, LoaderService, { provide: UserService, useValue: userServiceMock },
//         {
//             provide: UserDetailsComponent,
//             useValue: userDetailsComponentMock,
//         }, provideHttpClient(withInterceptorsFromDi()),]
// }).compileComponents();

//     fixture = TestBed.createComponent(UserListComponent);
//     component = fixture.componentInstance;

//     const toasterFixture = TestBed.createComponent(ToasterComponent);
//     component.toaster = toasterFixture.componentInstance;

//     loaderService = TestBed.inject(LoaderService);
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('ngOnInit(): should call loadGrid on initialization to fetch user data', () => {
//     spyOn(component, 'loadGrid');
//     component.ngOnInit();
//     expect(component.loadGrid).toHaveBeenCalled();
//   });

//   it('ngOnInit(): should subscribe to reloadGrid$ and call loadGrid when triggered', () => {
//     spyOn(component, 'loadGrid');

//     component.ngOnInit();

//     // Simulate the triggering of the reloadGrid$ observable
//     globalServiceMock.reloadGrid$.next(SKPTModules.USER);

//     expect(component.loadGrid).toHaveBeenCalledTimes(2);
//   });

//   it('ngOnInit(): should subscribe to refreshList$ and call applyFilters when triggered', () => {
//     spyOn(component, 'loadGrid');
//     spyOn(component, 'applyFilters');

//     component.ngOnInit();

//     // Simulate the triggering of the refreshList$ observable
//     globalServiceMock.refreshList$.next(SKPTModules.USER);

//     expect(component.applyFilters).toHaveBeenCalled();
//   });

//   it('loadGrid(): should fetch users data by calling get all users api with success response', () => {

//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();

//     const userMockData = UserMockDataService.getAllUsers();
//     userServiceMock.getAllUsers.and.returnValue(of({ data: userMockData }));

//     component.loadGrid();

//     expect(component.dataSource).toEqual(userMockData);
//     expect(component.filteredDataSource).toEqual(userMockData);
//     expect(spyLoaderHide).toHaveBeenCalled();

//   });

//   it('loadGrid(): should fetch users data by calling get all users api with success response but data is not present', () => {

//     const spyLoaderHide = spyOn(loaderService, 'hideLoader').and.callThrough();
//     const spyToaster = spyOn(component.toaster, 'showMessage').and.callThrough();

//     const userMockData = UserMockDataService.getAllUsers();
//     userServiceMock.getAllUsers.and.returnValue(of({ userMockData }));

//     component.loadGrid();  // Manually trigger getAllUsers after mock setup

//     expect(spyToaster).toHaveBeenCalledWith(Messages.ERROR_IN_FETCH_USER, 'error');
//     expect(spyLoaderHide).toHaveBeenCalled();

//   });

//   it('loadGrid(): should handle error during user data fetch', () => {
//     const errorMessage = 'Network error';
//     // Simulate an error response
//     userServiceMock.getAllUsers.and.returnValue(throwError(() => new Error(errorMessage)));

//     spyOn(console, 'error');

//     component.loadGrid();
//     expect(console.error).toHaveBeenCalledWith(Messages.ERROR_IN_FETCH_USER, jasmine.any(Error));
//   });

//   it('searchByText(): should filter the dataSource based on the search text and refresh the table', () => {
//     // Arrange
//     const mockData = UserMockDataService.getAllUsers();
//     userServiceMock.getAllUsers.and.returnValue(of({ data: mockData }));
//     component.dataSource = mockData;
//     spyOn(component, 'applyFilters').and.callThrough();

//     // Act
//     const mockEvent = { target: { value: 'test' } };
//     component.searchByText(mockEvent);

//     // Assert
//     expect(component.searchText).toBe('test');
//     expect(component.applyFilters).toHaveBeenCalled();
//     expect(component.filteredDataSource.length).toBeLessThanOrEqual(
//       mockData.length
//     );
//   });

//   it('openUserDetailsPopup(): should call openUserDetailsPopup on UserDetailsComponent with correct ID', () => {
//     // Initialize the ViewChild manually
//     component.userDetailsComponent = userDetailsComponentMock;
//     const testUserId = '123';

//     component.openUserDetailsPopup(testUserId);

//     expect(
//       userDetailsComponentMock.openUserDetailsPopup
//     ).toHaveBeenCalledWith(testUserId, null);
//   });


// // ============ Below test cases are not in use ============





//   // it('should update selectedPage and refreshTable on pageChange', () => {
//   //   spyOn(component, 'refreshTable');

//   //   // Initial state
//   //   component.paginationStatus = {
//   //     selectedPage: 1,
//   //     itemsPerPage: 10,
//   //     totalPages: 5,
//   //   } as PaginationStatus;

//   //   // Act
//   //   const newPage = 3;
//   //   component.pageChange(newPage);

//   //   // Assert
//   //   expect(component.paginationStatus.selectedPage).toBe(newPage);
//   //   expect(component.refreshTable).toHaveBeenCalledWith(false);
//   // });

//   // it('should refresh the table correctly', () => {
//   //   component.dataSource = [
//   //     { name: 'Yash', description: 'Desc 1' },
//   //     { name: 'Milind', description: 'Desc 2' },
//   //     { name: 'Faruk', description: 'Desc 3' },
//   //     { name: 'Delendra', description: 'Desc 4' },
//   //     { name: 'Kamlesh', description: 'Desc 5' },
//   //   ];

//   //   component.filteredDataSource = component.dataSource;
//   //   component.paginationStatus = {
//   //     selectedPage: 1,
//   //     itemsPerPage: 2,
//   //     totalPages: 3,
//   //   };

//   //   component.refreshTable(false);

//   //   expect(component.dataToDisplayInGrid.length).toBe(2);
//   //   expect(component.dataToDisplayInGrid).toEqual([
//   //     { name: 'Yash', description: 'Desc 1' },
//   //     { name: 'Milind', description: 'Desc 2' },
//   //   ]);

//   // });

//   // it('nextPage(): should increment selectedPage and call refreshTable on nextPage', () => {
//   //   spyOn(component, 'refreshTable');

//   //   // Initial state
//   //   component.paginationStatus = {
//   //     selectedPage: 1,
//   //     itemsPerPage: 10,
//   //     totalPages: 5,
//   //   } as PaginationStatus;

//   //   // Act
//   //   component.nextPage();

//   //   // Assert
//   //   expect(component.paginationStatus.selectedPage).toBe(2);
//   //   expect(component.refreshTable).toHaveBeenCalledWith(false);
//   // });

//   // it('nextPage(): should not increment selectedPage beyond totalPages', () => {
//   //   spyOn(component, 'refreshTable');

//   //   // Setup state where selectedPage is at the last page
//   //   component.paginationStatus = {
//   //     selectedPage: 3,
//   //     itemsPerPage: 10,
//   //     totalPages: 3,
//   //   } as PaginationStatus;
//   //   const expectedSelectedPage = component.paginationStatus.selectedPage + 1;

//   //   // Act
//   //   component.nextPage();

//   //   // Assert
//   //   expect(component.paginationStatus.selectedPage).toBe(expectedSelectedPage);
//   //   expect(component.refreshTable).toHaveBeenCalledWith(false);
//   // });

//   // it('nextPage(): should handle refreshing the table correctly when nextPage is called', () => {
//   //   // Setup initial data and pagination
//   //   component.dataSource = [
//   //     { name: 'John Doe', description: 'Desc 1' },
//   //     { name: 'Jane Doe', description: 'Desc 2' },
//   //     { name: 'Jim Doe', description: 'Desc 3' },
//   //     { name: 'Jake Doe', description: 'Desc 4' },
//   //     { name: 'Jess Doe', description: 'Desc 5' },
//   //   ];
//   //   component.filteredDataSource = component.dataSource;
//   //   component.paginationStatus = {
//   //     selectedPage: 1,
//   //     itemsPerPage: 2,
//   //     totalPages: 3,
//   //   } as PaginationStatus;

//   //   // Act
//   //   component.nextPage();

//   //   // Assert
//   //   expect(component.dataToDisplayInGrid.length).toBe(2);
//   //   expect(component.dataToDisplayInGrid).toEqual([
//   //     { name: 'Jim Doe', description: 'Desc 3' },
//   //     { name: 'Jake Doe', description: 'Desc 4' },
//   //   ]);
//   // });

//   // it('previousPage(): should decrease selectedPage and call refreshTable on previousPage', () => {
//   //   spyOn(component, 'refreshTable');

//   //   // Initial state
//   //   component.paginationStatus = {
//   //     selectedPage: 2,
//   //     itemsPerPage: 10,
//   //     totalPages: 5,
//   //   } as PaginationStatus;


//   //   const expectedSelectedPage = component.paginationStatus.selectedPage - 1;

//   //   // Act
//   //   component.previousPage();

//   //   // Assert
//   //   expect(component.paginationStatus.selectedPage).toBe(expectedSelectedPage);
//   //   expect(component.refreshTable).toHaveBeenCalledWith(false);
//   // });

//   // it('previousPage(): should not increment selectedPage beyond totalPages', () => {
//   //   spyOn(component, 'refreshTable');

//   //   // Setup state where selectedPage is at the last page
//   //   component.paginationStatus = {
//   //     selectedPage: 1,
//   //     itemsPerPage: 10,
//   //     totalPages: 3,
//   //   } as PaginationStatus;

//   //   const expectedSelectedPage = 1;

//   //   // Act
//   //   component.previousPage();

//   //   // Assert
//   //   expect(component.paginationStatus.selectedPage).toBe(expectedSelectedPage);
//   //   expect(component.refreshTable).toHaveBeenCalledWith(false);
//   // });

//   // it('searchByText(): should filter the dataSource based on the search text and refresh the table', () => {
//   //   // Arrange
//   //   const mockData = UserMockDataService.getAllUsers();
//   //   userServiceMock.getAllUsers.and.returnValue(of({ data: mockData }));
//   //   component.dataSource = mockData;
//   //   spyOn(component, 'applyFilters').and.callThrough();
//   //   spyOn(component, 'refreshTable').and.callThrough();

//   //   // Act
//   //   const mockEvent = { target: { value: 'test' } };
//   //   component.searchByText(mockEvent);

//   //   // Assert
//   //   expect(component.searchText).toBe('test');
//   //   expect(component.applyFilters).toHaveBeenCalled();
//   //   expect(component.filteredDataSource.length).toBeLessThanOrEqual(mockData.length);
//   //   expect(component.refreshTable).toHaveBeenCalledWith(true);
//   // });

//   // it('searchByText(): should reset the filteredDataSource when search text is empty', () => {
//   //   // Arrange
//   //   const mockData = UserMockDataService.getAllUsers();
//   //   userServiceMock.getAllUsers.and.returnValue(of({ data: mockData }));
//   //   component.dataSource = mockData;
//   //   component.filteredDataSource = [];
//   //   spyOn(component, 'applyFilters').and.callThrough();
//   //   spyOn(component, 'refreshTable').and.callThrough();

//   //   // Act
//   //   const mockEvent = { target: { value: '' } };
//   //   component.searchByText(mockEvent);

//   //   // Assert
//   //   expect(component.searchText).toBe('');
//   //   expect(component.applyFilters).toHaveBeenCalled();
//   //   expect(component.filteredDataSource).toEqual(mockData);
//   //   expect(component.refreshTable).toHaveBeenCalledWith(true);
//   // });

//   // it('onItemsPerPageChange(): should change itemsPerPage and refresh the table when onitemsPerPageChange is called', () => {
//   //   // Arrange
//   //   const mockData = UserMockDataService.getAllUsers();
//   //   userServiceMock.getAllUsers.and.returnValue(of({ data: mockData }));
//   //   component.loadGrid();

//   //   spyOn(component, 'refreshTable');
//   //   const event = { target: { value: Constants.SELECT_ALL } };

//   //   // Act
//   //   component.onItemsPerPageChange(event);

//   //   // Assert
//   //   expect(component.paginationStatus.selectedPage).toBe(1); // reset to first page
//   //   expect(component.refreshTable).toHaveBeenCalledWith(true);

//   //   // Act with a different value
//   //   const newEvent = { target: { value: 5 } };
//   //   component.onItemsPerPageChange(newEvent);

//   //   // Assert
//   //   expect(component.paginationStatus.itemsPerPage).toBe(5);
//   //   expect(component.paginationStatus.selectedPage).toBe(1);
//   //   expect(component.refreshTable).toHaveBeenCalledWith(true);
//   // });

//   // Need to recheck

//   // it('sortarr(key: string): should sort data in ascending order by userName on first click', () => {
//   //   component.dataToDisplayInGrid = UserMockDataService.getAllUsers();
//   //   component.sortarr('userName');
//   //   expect(component.dataToDisplayInGrid[0].userName).toBe('basic user');
//   //   expect(component.dataToDisplayInGrid[1].userName).toBe('Client User');
//   //   expect(component.dataToDisplayInGrid[2].userName).toBe('Kamlesh');
//   //   expect(component.dataToDisplayInGrid[3].userName).toBe('Super Admin');
//   //   expect(component.reverse).toBe(false);
//   // });

//   // it('sortarr(key: string): should sort data in descending order by userName on second click', () => {
//   //   component.dataToDisplayInGrid = UserMockDataService.getAllUsers();
//   //   // First click
//   //   component.sortarr('userName');
//   //   // Second click
//   //   component.sortarr('userName');
//   //   expect(component.dataToDisplayInGrid[0].userName).toBe('Test User');
//   //   expect(component.dataToDisplayInGrid[1].userName).toBe('Super Admin');
//   //   expect(component.dataToDisplayInGrid[2].userName).toBe('Kamlesh');
//   //   expect(component.dataToDisplayInGrid[3].userName).toBe('Client User');
//   //   expect(component.reverse).toBe(true);
//   // });

//   // it('sortarr(key: string): should reset sorting direction and data on third click', () => {
//   //   component.dataToDisplayInGrid = UserMockDataService.getAllUsers();

//   //   spyOn(component, 'applyFilters');
//   //   // First click
//   //   component.sortarr('userName');
//   //   // Second click
//   //   component.sortarr('userName');
//   //   // Third click
//   //   component.sortarr('userName');
//   //   expect(component.sortClickCount).toBe(0);
//   //   expect(component.dataToDisplayInGrid[0].userName).toBe('basic user');
//   //   expect(component.dataToDisplayInGrid[1].userName).toBe('Client User');
//   //   expect(component.dataToDisplayInGrid[2].userName).toBe('Kamlesh');
//   //   expect(component.dataToDisplayInGrid[3].userName).toBe('Super Admin');
//   //   expect(component.applyFilters).toHaveBeenCalled();
//   // });

//   // it('sortarr(key: string): should sort by a different column and reset reverse flag', () => {
//   //   component.dataToDisplayInGrid = UserMockDataService.getAllUsers();
//   //   // Sort by programName first
//   //   component.sortarr('userName');
//   //   expect(component.reverse).toBe(false);

//   //   // Now sort by phase (should reset reverse flag)
//   //   component.sortarr('role');
//   //   expect(component.reverse).toBe(false);
//   //   expect(component.key).toBe('role');
//   //   expect(component.dataToDisplayInGrid[0].role).toBe('Admin');
//   // });


//   // describe('onSortClick', () => {
//   //   let event: any;
//   //   const mockData = UserMockDataService.getAllUsers();


//   //   beforeEach(() => {
//   //     component.dataToDisplayInGrid = mockData;
//   //     event = {
//   //       currentTarget: {
//   //         classList: {
//   //           contains: jasmine.createSpy(),
//   //           add: jasmine.createSpy(),
//   //           remove: jasmine.createSpy()
//   //         }
//   //       }
//   //     };
//   //   });

//   //   it('should set to ascending order on the first click', () => {
//   //     event.currentTarget.classList.contains.and.returnValue(false);

//   //     spyOn(component, 'sortarr');
//   //     component.onSortClick(event, 'programName');

//   //     expect(event.currentTarget.classList.add).toHaveBeenCalledWith('bi-arrow-up');
//   //     expect(component.sortDir).toBe(1);
//   //     expect(component.sortarr).toHaveBeenCalledWith('programName');
//   //   });

//   //   it('should set to descending order on the second click', () => {
//   //     event.currentTarget.classList.contains.and.callFake((className: string) => className === 'bi-arrow-up');
//   //     spyOn(component, 'sortarr');
//   //     component.onSortClick(event, 'programName');

//   //     expect(event.currentTarget.classList.remove).toHaveBeenCalledWith('bi-arrow-up');
//   //     expect(event.currentTarget.classList.add).toHaveBeenCalledWith('bi-arrow-down');
//   //     expect(component.sortDir).toBe(-1);
//   //     expect(component.sortarr).toHaveBeenCalledWith('programName');
//   //   });

//   //   it('should reset sorting on the third click', () => {
//   //     event.currentTarget.classList.contains.and.callFake((className: string) => className === 'bi-arrow-down');
//   //     spyOn(component, 'sortarr');
//   //     component.onSortClick(event, 'programName');

//   //     expect(event.currentTarget.classList.remove).toHaveBeenCalledWith('bi-arrow-up', 'bi-arrow-down');
//   //     expect(component.sortDir).toBe(0);
//   //     expect(component.sortarr).toHaveBeenCalledWith('programName');
//   //   });
//   // });

// });
