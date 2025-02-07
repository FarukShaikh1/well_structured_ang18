import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablePaginationComponent } from './table-pagination.component';

describe('TablePaginationComponent', () => {
  let component: TablePaginationComponent;
  let fixture: ComponentFixture<TablePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TablePaginationComponent);
    component = fixture.componentInstance;

    // Mock data for testing
    component.filteredDataSource = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ];
    component.moduleName = 'testModule';
    component.tableUtils = {
      paginationCountingMessage: '',
      pageSizeOptions: [5, 10, 20],
      paginationStatus: {
        selectedPage: 1,
        itemsPerPage: 10,
        totalPages: 1
      },
      isDisabledNextBtn: false,
      isDisabledPrevBtn: false,
      pageChange: jasmine.createSpy('pageChange'),
      nextPage: jasmine.createSpy('nextPage'),
      previousPage: jasmine.createSpy('previousPage'),
      onItemsPerPageChange: jasmine.createSpy('onItemsPerPageChange')
    };

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call pageChange method when clicking on a page link', () => {
    const pageLink = fixture.nativeElement.querySelector('.page-link');
    pageLink.click();
    expect(component.tableUtils.pageChange).toHaveBeenCalledWith(1, component.filteredDataSource);
  });

  it('should call nextPage method when clicking on next button', () => {
    const nextButton = fixture.nativeElement.querySelectorAll('.page-link')[2]; // assuming it's the "next" button
    nextButton.click();
    expect(component.tableUtils.nextPage).toHaveBeenCalledWith(component.filteredDataSource);
  });

  it('should call previousPage method when clicking on previous button', () => {
    const prevButton = fixture.nativeElement.querySelectorAll('.page-link')[1]; // assuming it's the "prev" button
    prevButton.click();
    expect(component.tableUtils.previousPage).toHaveBeenCalledWith(component.filteredDataSource);
  });

  it('should call onItemsPerPageChange method when changing items per page', () => {
    const select = fixture.nativeElement.querySelector('#pageSizeSelect');
    select.value = 5;
    select.dispatchEvent(new Event('change'));
    expect(component.tableUtils.onItemsPerPageChange).toHaveBeenCalledWith(jasmine.any(Event), component.moduleName);
  });

  it('should render correct number of page options', () => {
    const options = fixture.nativeElement.querySelectorAll('#pageSizeSelect option');
    expect(options.length).toBe(3); // Based on mocked `pageSizeOptions`
  });

  it('should disable next button when on the last page', () => {
    component.tableUtils.paginationStatus.selectedPage = 1;
    component.tableUtils.paginationStatus.totalPages = 1;
    component.tableUtils.isDisabledNextBtn = true;
    fixture.detectChanges();

    const nextButton = fixture.nativeElement.querySelector('.page-link[alt="Next"]');
    expect(nextButton.disabled).toBeTruthy();
  });

  it('should disable previous button when on the first page', () => {
    component.tableUtils.paginationStatus.selectedPage = 1;
    component.tableUtils.isDisabledPrevBtn = true;
    fixture.detectChanges();

    const prevButton = fixture.nativeElement.querySelector('.page-link[alt="Prev"]');
    expect(prevButton.disabled).toBeTruthy();
  });

  it('should display the correct pagination counting message', () => {
    component.tableUtils.paginationCountingMessage = 'Showing 1-3 Out Of 3 results.';
    fixture.detectChanges();

    const messageElement = fixture.nativeElement.querySelector('.results-info p');
    expect(messageElement.innerHTML).toContain('Showing 1-3 Out Of 3 results.');
  });
});
