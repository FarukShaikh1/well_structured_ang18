import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { LoaderService } from '../../services/loader/loader.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let isLoadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isLoadingSubject = new BehaviorSubject<boolean>(false);

    const loaderServiceMock = {
      isLoading$: isLoadingSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
    imports: [LoaderComponent],
    providers: [{ provide: LoaderService, useValue: loaderServiceMock }],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display loader when isLoading$ is false', () => {
    isLoadingSubject.next(false);
    fixture.detectChanges();
    const loaderElement = fixture.debugElement.query(By.css('.loader-overlay'));
    expect(loaderElement).toBeNull();
  });

  it('should display loader when isLoading$ is true', () => {
    isLoadingSubject.next(true);
    fixture.detectChanges();
    const loaderElement = fixture.debugElement.query(By.css('.loader-overlay'));
    expect(loaderElement).not.toBeNull();
  });

  it('should display loader with spinner', () => {
    isLoadingSubject.next(true);
    fixture.detectChanges();
    const loaderElement = fixture.debugElement.query(By.css('.loader-overlay'));
    const spinnerElement = fixture.debugElement.query(By.css('.spinner-border'));
    expect(loaderElement).not.toBeNull();
    expect(spinnerElement).not.toBeNull();
  });
});
