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
        done(); 
      }
    });

    service.showLoader();
  });

  it('should emit false when hideLoader is called', (done) => {
    
    service.showLoader();

    
    service.isLoading$.subscribe((isLoading) => {
      if (!isLoading) {
        expect(isLoading).toBeFalse();
        done(); 
      }
    });

    service.hideLoader();
  });
});
