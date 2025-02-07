import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService],
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when showLoader is called', (done) => {
    service.isLoading$.subscribe((isLoading) => {
      if (isLoading) {
        expect(isLoading).toBeTrue();
        done(); // Ensure the test finishes only after the expected value is emitted
      }
    });

    service.showLoader();
  });

  it('should emit false when hideLoader is called', (done) => {
    // First, show the loader
    service.showLoader();

    // Then, hide it and check
    service.isLoading$.subscribe((isLoading) => {
      if (!isLoading) {
        expect(isLoading).toBeFalse();
        done(); // Ensure the test finishes only after the expected value is emitted
      }
    });

    service.hideLoader();
  });
});
